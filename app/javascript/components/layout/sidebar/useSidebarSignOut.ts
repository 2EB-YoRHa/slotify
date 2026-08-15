import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
  UNSAVED_GUARD_BLOCKED_EVENT,
  UNSAVED_GUARD_CONFIRMED_EVENT,
} from "../../../hooks/useUnsavedChangesGuard";

export default function useSidebarSignOut() {
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    function handleBlockedNavigation() {
      setSigningOut(false);
    }

    function handleConfirmedNavigation(event: Event) {
      const customEvent = event as CustomEvent<{
        url?: string;
        method?: string;
      }>;

      const url = customEvent.detail?.url || "";
      const method = customEvent.detail?.method || "";

      if (
        url.includes("/users/sign_out") &&
        method.toLowerCase() === "delete"
      ) {
        setSigningOut(true);
      }
    }

    const removeFinishListener = router.on("finish", () => {
      setSigningOut(false);
    });

    window.addEventListener(
      UNSAVED_GUARD_BLOCKED_EVENT,
      handleBlockedNavigation,
    );

    window.addEventListener(
      UNSAVED_GUARD_CONFIRMED_EVENT,
      handleConfirmedNavigation,
    );

    return () => {
      removeFinishListener();

      window.removeEventListener(
        UNSAVED_GUARD_BLOCKED_EVENT,
        handleBlockedNavigation,
      );

      window.removeEventListener(
        UNSAVED_GUARD_CONFIRMED_EVENT,
        handleConfirmedNavigation,
      );
    };
  }, []);

  function signOut() {
    setSigningOut(true);

    router.delete("/users/sign_out", {
      onFinish: () => setSigningOut(false),
    });
  }

  return { signingOut, signOut };
}