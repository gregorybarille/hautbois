import { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'normal' | 'compact' | 'side';
export type CardBg = 'base-100' | 'base-200' | 'base-300' | 'neutral' | 'primary';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  bg?: CardBg;
  bordered?: boolean;
  imageFull?: boolean;
  glass?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hover?: boolean; // Adds hover effect/scale
  fullWidth?: boolean;
  noBody?: boolean; // If true, the caller is responsible for adding <div className="card-body">
}

export const Card = ({
  children,
  variant,
  bg = 'base-100',
  bordered,
  imageFull,
  glass,
  shadow = 'xl',
  hover,
  fullWidth,
  noBody = false,
  className = '',
  ...props
}: CardProps) => {
  const classes = [
    'card',
    bg ? `bg-${bg}` : '',
    variant === 'compact' ? 'card-compact' : '',
    variant === 'side' ? 'card-side' : '',
    bordered ? 'card-bordered' : '',
    imageFull ? 'image-full' : '',
    glass ? 'glass' : '',
    shadow && shadow !== 'none' ? `shadow-${shadow}` : '',
    hover ? 'hover:shadow-2xl transition-all duration-300 hover:scale-105' : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {noBody ? children : <div className="card-body">{children}</div>}
    </div>
  );
};
