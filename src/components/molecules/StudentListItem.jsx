import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';

const StudentListItem = ({ student, studentClasses, isSelected, onSelect, onDelete, delay = 0 }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="px-6 py-4 hover:bg-gray-50 transition-colors"
    &gt;
      &lt;div className="flex items-center justify-between"&gt;
        &lt;div className="flex items-center space-x-4"&gt;
          &lt;Checkbox checked={isSelected} onChange={() => onSelect(student.id)} /&gt;
          &lt;div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"&gt;
            &lt;ApperIcon name="User" className="w-5 h-5 text-gray-600" /&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;Text type="h3" className="text-sm font-medium text-gray-900"&gt;{student.name}&lt;/Text&gt;
            &lt;Text type="p" className="text-sm text-gray-500"&gt;{student.email}&lt;/Text&gt;
            {studentClasses.length > 0 && (
              &lt;div className="flex items-center space-x-1 mt-1"&gt;
                {studentClasses.slice(0, 2).map(classItem => (
                  &lt;span
                    key={classItem.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  &gt;
                    {classItem.name}
                  &lt;/span&gt;
                ))}
                {studentClasses.length > 2 && (
                  &lt;Text type="span" className="text-xs text-gray-500"&gt;
                    +{studentClasses.length - 2} more
                  &lt;/Text&gt;
                )}
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div className="flex items-center space-x-2"&gt;
          &lt;Button variant="ghost" onClick={() => onDelete(student.id)} className="p-2 text-gray-400 hover:text-red-500"&gt;
            &lt;ApperIcon name="Trash2" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/motion.div&gt;
  );
};

export default StudentListItem;