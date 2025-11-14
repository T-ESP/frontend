import type { InputHTMLAttributes } from "react";

export type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  showToggle?: boolean;
};