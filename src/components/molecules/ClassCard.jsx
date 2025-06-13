import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const ClassCard = ({ classItem, studentCount, onDelete, delay = 0 }) => {
  return (
    &lt;Card animate delay={delay} whileHover={{ scale: 1.02 }}&gt;
      &lt;div className="flex items-start justify-between mb-4"&gt;
        &lt;div className="flex-1 min-w-0"&gt;
          &lt;Heading level={3} className="text-lg font-semibold truncate"&gt;
            {classItem.name}
          &lt;/Heading&gt;
          &lt;Text type="p" className="text-sm text-gray-600 truncate"&gt;{classItem.subject}&lt;/Text&gt;
        &lt;/div&gt;
        &lt;div className="flex items-center space-x-2 ml-4"&gt;
          &lt;Button variant="ghost" onClick={() => onDelete(classItem.id)} className="p-1 text-gray-400 hover:text-red-500"&gt;
            &lt;ApperIcon name="Trash2" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="flex items-center justify-between"&gt;
        &lt;div className="flex items-center space-x-2"&gt;
          &lt;ApperIcon name="Users" className="w-4 h-4 text-gray-400" /&gt;
          &lt;Text type="span" className="text-sm text-gray-600"&gt;
            {studentCount} students
          &lt;/Text&gt;
        &lt;/div&gt;
        &lt;div className="flex items-center space-x-1"&gt;
          &lt;Button variant="ghost" className="p-2 text-gray-400 hover:text-primary"&gt;
            &lt;ApperIcon name="Eye" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
          &lt;Button variant="ghost" className="p-2 text-gray-400 hover:text-secondary"&gt;
            &lt;ApperIcon name="Bell" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="mt-4 pt-4 border-t border-gray-100"&gt;
        &lt;Text type="p" className="text-xs text-gray-500"&gt;
          Created {new Date(classItem.createdAt).toLocaleDateString()}
        &lt;/Text&gt;
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default ClassCard;