import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Heading from '@/components/atoms/Heading';

const QuickActionCard = ({ title, description, icon, color, onClick, ...props }) => {
  return (
    &lt;motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
      {...props}
    &gt;
      &lt;div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mr-4`}&gt;
        &lt;ApperIcon name={icon} className="w-5 h-5 text-white" /&gt;
      &lt;/div&gt;
      &lt;div className="flex-1 text-left"&gt;
        &lt;Heading level={3} className="font-medium text-gray-900 text-base"&gt;{title}&lt;/Heading&gt;
        &lt;Text type="p" className="text-sm text-gray-500"&gt;{description}&lt;/Text&gt;
      &lt;/div&gt;
      &lt;ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" /&gt;
    &lt;/motion.button&gt;
  );
};

export default QuickActionCard;