import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';
    
    const variants = {
      primary: 'bg-[#0066ff] text-white hover:bg-[#0052cc] focus-visible:ring-[#0066ff] shadow-lg hover:shadow-xl',
      secondary: 'bg-white text-[#0066ff] border border-[#0066ff] hover:bg-[#e6f2ff] focus-visible:ring-[#0066ff] shadow-md hover:shadow-lg',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 shadow-sm hover:shadow-md',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-12 px-8 text-lg'
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Cargando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };