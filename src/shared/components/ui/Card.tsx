import { Paper, PaperProps } from "@mantine/core";
import { ReactNode } from "react";

interface CardProps extends Omit<PaperProps, "shadow"> {
  children: ReactNode;
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  shadow = "md",
  hover = false,
  fullWidth = false,
  noPadding = false,
  className = "",
  style,
  onClick,
  ...props
}: CardProps) => {
  return (
    <Paper
      shadow={shadow}
      p={noPadding ? 0 : "xl"}
      radius="md"
      withBorder
      onClick={onClick}
      className={`${hover ? "hover:shadow-xl transition-shadow duration-200" : ""} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        ...style,
        ...(hover ? { cursor: "pointer" } : {}),
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};
