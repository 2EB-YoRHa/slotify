export type TwoFactorSettings = {
  enabled: boolean;
  setup_key?: string | null;
  provisioning_uri?: string | null;
  account_label: string;
  issuer: string;
};

export type PasswordFormData = {
  user: {
    current_password: string;
    password: string;
    password_confirmation: string;
  };
};

export type TwoFactorFormData = {
  two_factor: {
    code: string;
    current_password: string;
  };
};