import type { OrganizationUser } from "../../types/organization";

type OrganizationMembersTableProps = {
  users: OrganizationUser[];
};

export default function OrganizationMembersTable({
  users,
}: OrganizationMembersTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Team Members</h2>

          <p className="mt-1 text-sm text-slate-500">
            Users assigned to this organization.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search members..."
          className="w-72 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-400"
        />
      </div>

      {users.length === 0 ? (
        <div className="p-10 text-center text-slate-400">
          No users found for this organization.
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Member</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 font-bold text-cyan-500">
                      {initials(user.name)}
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900">
                        {user.name}
                      </div>

                      <div className="text-xs text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {formatRole(user.role?.name)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      user.active
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="text-sm font-semibold text-slate-400"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role?: string | null): string {
  if (!role) return "No role";

  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}