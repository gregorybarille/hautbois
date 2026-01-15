import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from "@mantine/core";
import { ReactNode } from "react";

export type ButtonVariant =
  | "filled"
  | "light"
  | "outline"
  | "subtle"
  | "transparent"
  | "white"
  | "default";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<MantineButtonProps, "variant" | "size"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = "filled",
  size = "md",
  fullWidth = false,
  loading = false,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <MantineButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
