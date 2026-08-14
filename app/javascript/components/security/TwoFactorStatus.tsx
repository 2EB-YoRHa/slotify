import { CheckCircle2, TriangleAlert } from "lucide-react";

export default function TwoFactorStatus({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
        enabled
          ? "bg-green-50 text-green-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {enabled ? <CheckCircle2 size={17} /> : <TriangleAlert size={17} />}
      {enabled ? "2FA enabled" : "2FA not enabled"}
    </div>
  );
}