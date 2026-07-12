import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-primary';

  const sizeClass = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  }[size] || '';

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'lg' ? 18 : 15} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'lg' ? 18 : 15} />}
    </motion.button>
  );
};

export default Button;
