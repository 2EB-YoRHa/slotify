import { router } from "@inertiajs/react";
import { useSyncExternalStore } from "react";

type NavigationState = {
  loading: boolean;
  path: string;
  method: string;
};

type VisitLike = {
  url: URL | string;
  method?: string;
};

let state: NavigationState = {
  loading: false,
  path: typeof window === "undefined" ? "/" : window.location.pathname,
  method: "get",
};

let initialized = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: NavigationState) {
  state = nextState;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function normalizePath(value: URL | string): string {
  if (value instanceof URL) return value.pathname;

  try {
    return new URL(value, window.location.origin).pathname;
  } catch {
    return value.split("?")[0] || "/";
  }
}

function initializeNavigationLoading() {
  if (initialized) return;

  initialized = true;

  router.on("start", (event) => {
    const visit = event.detail.visit as VisitLike;
    const method = String(visit.method || "get").toLowerCase();
    const path = normalizePath(visit.url);

    if (method !== "get") {
      setState({
        loading: false,
        path,
        method,
      });

      return;
    }

    setState({
      loading: true,
      path,
      method,
    });
  });

  router.on("finish", () => {
    setState({
      ...state,
      loading: false,
    });
  });
}

export function useNavigationLoading() {
  initializeNavigationLoading();

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}