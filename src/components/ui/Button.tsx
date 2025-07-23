// Add to src/components/ui/Button.tsx (add 'as' prop support)
import React from 'react'
import  clsx  from "clsx";

// Polymorphic ButtonProps with generic for ref and props
type ButtonProps<C extends React.ElementType = 'button'> = {
  as?: C;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tailor';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & Omit<React.ComponentPropsWithRef<C>, 'as' | 'size' | 'variant' | 'loading' | 'fullWidth' | 'className' | 'disabled' | 'children'>;

const ButtonInner = <C extends React.ElementType = 'button'>(
  {
    as,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className,
    disabled,
    children,
    ...props
  }: ButtonProps<C>,
  ref: React.ForwardedRef<unknown>
) => {
  const Component = as || 'button';
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    tailor: 'bg-tailor-600 text-white hover:bg-tailor-700 focus:ring-tailor-500 shadow-lg hover:shadow-xl',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    // @ts-expect-error: Polymorphic component typing limitation
    <Component
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      disabled={Component === 'button' ? disabled || loading : undefined}
      aria-disabled={Component !== 'button' ? disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </Component>
  );
};

export const Button = React.forwardRef(ButtonInner);

// Set displayName in a type-safe way
(Button as unknown as { displayName: string }).displayName = 'Button'