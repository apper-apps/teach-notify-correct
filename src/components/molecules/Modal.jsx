import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const Modal = ({ isOpen, onClose, title, children, className = '', ...props }) => {
  if (!isOpen) return null;

  return (
    &lt;div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"&gt;
      &lt;motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-lg shadow-xl w-full p-6 max-h-[90vh] overflow-y-auto ${className}`}
        {...props}
      &gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;Heading level={2} className="text-xl font-semibold"&gt;{title}&lt;/Heading&gt;
          &lt;Button variant="ghost" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600"&gt;
            &lt;ApperIcon name="X" className="w-5 h-5" /&gt;
          &lt;/Button&gt;
        &lt;/div&gt;
        {children}
      &lt;/motion.div&gt;
    &lt;/div&gt;
  );
};

export default Modal;