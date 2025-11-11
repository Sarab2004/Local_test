import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-blue-600 focus-visible:ring-blue-500',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-400',
  ghost: 'hover:bg-slate-100',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: keyof typeof variants
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={clsx(baseStyles, variants[variant], className, 'px-4 py-2')}
        ref={ref as any}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
