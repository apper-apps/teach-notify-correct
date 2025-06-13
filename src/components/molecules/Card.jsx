import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = false, delay = 0, ...props }) => {
  const baseClasses = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
  const finalClasses = `${baseClasses} ${className}`;

  const MotionComponent = animate ? motion.div : 'div';

  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay }
  } : {};

return (
    <MotionComponent className={finalClasses} {...animationProps} {...props}>
      {children}
    </MotionComponent>
  );
};

export default Card;