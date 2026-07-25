import { router } from "@inertiajs/react";
import { useSyncExternalStore } from "react";

type NavigationState = {
  loading: boolean;
  path: string;
};

let state: NavigationState = {
  loading: false,
  path: typeof window === "undefined" ? "/" : window.location.pathname,
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

function extractPath(value: URL | string): string {
  if (typeof value === "string") {
    return value;
  }

  return value.pathname;
}

function initializeNavigationLoading() {
  if (initialized) return;

  initialized = true;

  router.on("start", (event) => {
    setState({
      loading: true,
      path: extractPath(event.detail.visit.url),
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