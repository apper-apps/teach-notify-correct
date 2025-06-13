import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'primary', icon: Icon, loading = false, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed',
    accent: 'bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed',
    info: 'bg-info text-white hover:bg-info/90 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
    link: 'text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent'
  };

  const finalClasses = `${baseClasses} ${variants[variant]} ${className}`;

  const MotionComponent = props.whileHover || props.whileTap ? motion.button : 'button';

  return (
    &lt;MotionComponent
      className={finalClasses}
      disabled={loading || props.disabled}
      {...props}
    &gt;
      {loading && &lt;Icon name="Loader2" className="w-4 h-4 animate-spin" /&gt;}
      {!loading && Icon && &lt;Icon name={Icon} className="w-4 h-4" /&gt;}
      &lt;span&gt;{children}&lt;/span&gt;
    &lt;/MotionComponent&gt;
  );
};

export default Button;