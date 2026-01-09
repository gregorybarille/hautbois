import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral';

export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  wide?: boolean;
  block?: boolean;
  circle?: boolean;
  square?: boolean;
  loading?: boolean;
  glass?: boolean;
  active?: boolean;
}

export const Button = ({
  children,
  variant,
  size,
  outline,
  wide,
  block,
  circle,
  square,
  loading,
  glass,
  active,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const classes = [
    'btn',
    variant ? `btn-${variant}` : '',
    size ? `btn-${size}` : '',
    outline ? 'btn-outline' : '',
    wide ? 'btn-wide' : '',
    block ? 'btn-block' : '',
    circle ? 'btn-circle' : '',
    square ? 'btn-square' : '',
    glass ? 'glass' : '',
    active ? 'btn-active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );
};
