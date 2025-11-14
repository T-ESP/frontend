import type { ReactNode } from "react";

export type FormFieldProps = {
  label?: string;
  labelRight?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
};