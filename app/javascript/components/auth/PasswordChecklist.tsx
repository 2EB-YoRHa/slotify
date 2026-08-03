type PasswordChecklistProps = {
  password: string;
  passwordConfirmation: string;
};

export function isStrongPassword(
  password: string,
  passwordConfirmation: string,
): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length > 0 &&
    password === passwordConfirmation
  );
}

export default function PasswordChecklist({
  password,
  passwordConfirmation,
}: PasswordChecklistProps) {
  const checks = [
    {
      label: "8+ characters",
      checked: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      checked: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      checked: /[a-z]/.test(password),
    },
    {
      label: "Number",
      checked: /\d/.test(password),
    },
    {
      label: "Symbol",
      checked: /[^A-Za-z0-9]/.test(password),
    },
    {
      label: "Passwords match",
      checked: password.length > 0 && password === passwordConfirmation,
    },
  ];

  const ready = checks.every((check) => check.checked);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-bold text-slate-700">Password requirements</span>

        <span
          className={`font-bold ${
            ready ? "text-green-600" : "text-slate-500"
          }`}
        >
          {ready ? "Ready" : "Incomplete"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
        {checks.map((check) => (
          <CheckItem
            key={check.label}
            checked={check.checked}
            label={check.label}
          />
        ))}
      </div>
    </div>
  );
}

type CheckItemProps = {
  checked: boolean;
  label: string;
};

function CheckItem({ checked, label }: CheckItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          checked
            ? "bg-green-100 text-green-600"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {checked ? "✓" : "×"}
      </span>

      <span>{label}</span>
    </div>
  );
}