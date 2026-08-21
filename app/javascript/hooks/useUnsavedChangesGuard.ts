import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

type UnsavedChangesGuardOptions = {
  enabled: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

type InertiaVisitLike = {
  url?: string | URL;
  method?: string;
  data?: unknown;
  replace?: boolean;
  preserveScroll?: boolean;
  preserveState?: boolean;
  only?: string[];
  except?: string[];
  headers?: Record<string, string>;
  queryStringArrayFormat?: string;
};

type PendingNavigation = {
  url: string;
  method?: string;
  run: () => void;
};

export const UNSAVED_GUARD_BLOCKED_EVENT = "slotify:unsaved-guard-blocked";
export const UNSAVED_GUARD_CONFIRMED_EVENT = "slotify:unsaved-guard-confirmed";

export default function useUnsavedChangesGuard({
  enabled,
  title,
  description,
  confirmText = "Discard Changes",
  cancelText = "Keep Editing",
}: UnsavedChangesGuardOptions) {
  const enabledRef = useRef(enabled);
  const allowNextNavigationRef = useRef(false);
  const confirmOpenRef = useRef(false);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    confirmOpenRef.current = confirmOpen;
  }, [confirmOpen]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!enabledRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    return router.on("before", (event) => {
      if (!enabledRef.current) return;

      if (allowNextNavigationRef.current) {
        allowNextNavigationRef.current = false;
        return;
      }

      event.preventDefault();

      window.dispatchEvent(new CustomEvent(UNSAVED_GUARD_BLOCKED_EVENT));

      if (confirmOpenRef.current) return;

      const visit = event.detail.visit as InertiaVisitLike;
      const url = visitUrlToString(visit.url);
      const method = visit.method?.toLowerCase();

      pendingNavigationRef.current = {
        url,
        method,
        run: () => {
          allowNextNavigationRef.current = true;

          router.visit(url, {
            method: visit.method as never,
            data: visit.data as never,
            replace: visit.replace,
            preserveScroll: visit.preserveScroll,
            preserveState: visit.preserveState,
            only: visit.only,
            except: visit.except,
            headers: visit.headers,
            queryStringArrayFormat: visit.queryStringArrayFormat as never,
          });
        },
      };

      setConfirmOpen(true);
    });
  }, []);

  function allowNextNavigation() {
    allowNextNavigationRef.current = true;
  }

  function guardedVisit(href: string) {
    if (!enabledRef.current) {
      router.visit(href);
      return;
    }

    pendingNavigationRef.current = {
      url: href,
      method: "get",
      run: () => {
        allowNextNavigationRef.current = true;
        router.visit(href);
      },
    };

    window.dispatchEvent(new CustomEvent(UNSAVED_GUARD_BLOCKED_EVENT));
    setConfirmOpen(true);
  }

  function cancelNavigation() {
    pendingNavigationRef.current = null;
    setConfirmOpen(false);

    window.dispatchEvent(new CustomEvent(UNSAVED_GUARD_BLOCKED_EVENT));
  }

  function confirmNavigation() {
    const pendingNavigation = pendingNavigationRef.current;

    if (!pendingNavigation) {
      setConfirmOpen(false);
      return;
    }

    pendingNavigationRef.current = null;
    setConfirmOpen(false);

    window.dispatchEvent(
      new CustomEvent(UNSAVED_GUARD_CONFIRMED_EVENT, {
        detail: {
          url: pendingNavigation.url,
          method: pendingNavigation.method,
        },
      }),
    );

    pendingNavigation.run();
  }

  return {
    confirmOpen,
    title,
    description,
    confirmText,
    cancelText,
    allowNextNavigation,
    guardedVisit,
    cancelNavigation,
    confirmNavigation,
  };
}

function visitUrlToString(url?: string | URL): string {
  if (!url) return window.location.href;

  if (url instanceof URL) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return url;
}