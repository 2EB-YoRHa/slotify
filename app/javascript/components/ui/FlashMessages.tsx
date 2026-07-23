import { usePage } from "@inertiajs/react";
import { useState } from "react";

type Flash = {
  notice?: string | null;
  alert?: string | null;
};

type PageProps = {
  flash?: Flash;
};

type FlashMessage = {
  type: "success" | "error";
  title: string;
  message: string;
};

export default function FlashMessages() {
  const { flash } = usePage<PageProps>().props;

  const messages: FlashMessage[] = [];

  if (flash?.notice) {
    messages.push({
      type: "success",
      title: "Success",
      message: flash.notice,
    });
  }

  if (flash?.alert) {
    messages.push({
      type: "error",
      title: "Attention",
      message: flash.alert,
    });
  }

  if (messages.length === 0) return null;

  return (
    <div className="fixed right-6 top-6 z-100 w-full max-w-sm space-y-3">
      {messages.map((message) => (
        <FlashCard
          key={`${message.type}-${message.message}`}
          type={message.type}
          title={message.title}
          message={message.message}
        />
      ))}
    </div>
  );
}

type FlashCardProps = {
  type: "success" | "error";
  title: string;
  message: string;
};

function FlashCard({ type, title, message }: FlashCardProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles =
    type === "success"
      ? {
          wrapper: "border-green-100 bg-green-50 text-green-700",
          icon: "bg-green-100 text-green-600",
        }
      : {
          wrapper: "border-red-100 bg-red-50 text-red-700",
          icon: "bg-red-100 text-red-600",
        };

  return (
    <div
      className={`rounded-xl border p-4 shadow-lg backdrop-blur ${styles.wrapper}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${styles.icon}`}
        >
          {type === "success" ? "✓" : "!"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-sm leading-5">{message}</p>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-lg leading-none opacity-60 hover:opacity-100"
          aria-label="Close message"
        >
          ×
        </button>
      </div>
    </div>
  );
}