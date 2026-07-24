import { Link } from "@inertiajs/react";
import { useState } from "react";
import type { OrganizationUser } from "../../types/organization";

type OrganizationMembersTableProps = {
  users: OrganizationUser[];
  canManage?: boolean;
};

export default function OrganizationMembersTable({
  users,
  canManage = false,
}: OrganizationMembersTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      formatRole(user.role?.name).toLowerCase().includes(query)
    );
  });

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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search members..."
          className="w-72 rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-cyan-400"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="p-10 text-center text-slate-400">
          No members match your search.
        </div>
      ) : (
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[46%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 text-center align-middle font-medium">
                Members
              </th>

              <th className="px-6 py-4 text-center align-middle font-medium">
                Role
              </th>

              <th className="px-6 py-4 text-center align-middle font-medium">
                Status
              </th>

              <th className="px-6 py-4 text-center align-middle font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="h-18 border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-left align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 font-bold text-cyan-500">
                      {initials(user.name)}
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="truncate font-semibold text-slate-900">
                        {user.name}
                      </div>

                      <div className="truncate text-xs text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center">
                    <span className="inline-flex min-w-24 justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {formatRole(user.role?.name)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-xs font-bold ${
                        user.active
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center align-middle">
                  {canManage ? (
                    <Link
                      href={`/organization/members/${user.id}`}
                      className="text-sm font-bold text-cyan-500 hover:text-cyan-600"
                    >
                      Manage
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-slate-300">
                      -
                    </span>
                  )}
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
    .filter(Boolean)
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
