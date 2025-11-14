export type SimpleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  cancelText?: string;
  acceptText?: string;
  onCancel?: () => void;
  onAccept?: () => void;
  size?: "sm" | "md" | "lg";
};
