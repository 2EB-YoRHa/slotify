import type { SharedCurrentUser } from "../../../types/layout";
import { initials } from "../../../utils/layoutText";

type UserAvatarProps = {
  user?: SharedCurrentUser | null;
  billingRequired: boolean;
};

export default function UserAvatar({
  user,
  billingRequired,
}: UserAvatarProps) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ring-2 ring-transparent transition ${
        billingRequired
          ? "bg-amber-50 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300"
          : "bg-cyan-50 text-cyan-500 dark:bg-cyan-500/15 dark:text-cyan-300"
      }`}
    >
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user?.name || "Profile"}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(user?.name)
      )}
    </div>
  );
}