import { createInertiaApp } from "@inertiajs/react";

function csrfToken(): string | null {
  return (
    document.querySelector<HTMLMetaElement>("meta[name='csrf-token']")
      ?.content || null
  );
}

function csrfHeaders(): Record<string, string> {
  const token = csrfToken();

  return token ? { "X-CSRF-Token": token } : {};
}

void createInertiaApp({
  pages: "../pages",

  strictMode: true,

  progress: {
    color: "#22d3ee",
    showSpinner: false,
  },

  defaults: {
    form: {
      forceIndicesArrayFormatInFormData: false,
      withAllErrors: true,
    },
    visitOptions: (_href, options) => {
      return {
        queryStringArrayFormat: "brackets",
        headers: {
          ...options.headers,
          ...csrfHeaders(),
        },
      };
    },
  },
}).catch((error) => {
  if (document.getElementById("app")) {
    throw error;
  } else {
    console.error(
      "Missing root element.\n\n" +
        "If you see this error, it probably means you loaded Inertia.js on non-Inertia pages.\n" +
        'Consider moving <%= vite_typescript_tag "inertia.tsx" %> to the Inertia-specific layout instead.'
    );
  }
});