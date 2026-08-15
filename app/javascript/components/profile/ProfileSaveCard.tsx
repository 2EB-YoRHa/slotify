import LoadingButton from "../ui/LoadingButton";

type ProfileSaveCardProps = {
  processing: boolean;
  emailChanged: boolean;
};

export default function ProfileSaveCard({
  processing,
  emailChanged,
}: ProfileSaveCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <LoadingButton
        type="submit"
        loading={processing}
        loadingText="Saving..."
        className="w-full rounded-2xl py-4"
      >
        Save Profile
      </LoadingButton>

      <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">
        {emailChanged
          ? "Changing email requires your current password and email confirmation."
          : "Profile changes are saved to your current account."}
      </p>
    </section>
  );
}