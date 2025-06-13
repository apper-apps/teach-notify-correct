import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const AssignmentCard = ({ assignment, className, onDelete, onNotify, delay = 0 }) => {
  const isOverdue = new Date(assignment.dueDate) < new Date();
  const dueDate = new Date(assignment.dueDate);
  
  const statusClasses = isOverdue ? 'bg-error/10 text-error' : 'bg-success/10 text-success';

  return (
    &lt;Card animate delay={delay} className="hover:shadow-md transition-all duration-200"&gt;
      &lt;div className="flex items-start justify-between"&gt;
        &lt;div className="flex-1 min-w-0"&gt;
          &lt;div className="flex items-center space-x-3 mb-2"&gt;
            &lt;Heading level={3} className="text-lg font-semibold truncate"&gt;
              {assignment.title}
            &lt;/Heading&gt;
            &lt;span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`} &gt;
              {isOverdue ? 'Overdue' : 'Active'}
            &lt;/span&gt;
          &lt;/div&gt;
          
          &lt;div className="flex items-center space-x-4 text-sm text-gray-600 mb-3"&gt;
            {className && (
              &lt;div className="flex items-center space-x-1"&gt;
                &lt;ApperIcon name="Users" className="w-4 h-4" /&gt;
                &lt;Text type="span"&gt;{className}&lt;/Text&gt;
              &lt;/div&gt;
            )}
            &lt;div className="flex items-center space-x-1"&gt;
              &lt;ApperIcon name="Calendar" className="w-4 h-4" /&gt;
              &lt;Text type="span"&gt;Due {dueDate.toLocaleDateString()}&lt;/Text&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          {assignment.description && (
            &lt;Text type="p" className="text-gray-600 text-sm break-words"&gt;
              {assignment.description}
            &lt;/Text&gt;
          )}
        &lt;/div&gt;

        &lt;div className="flex items-center space-x-2 ml-4"&gt;
          &lt;Button variant="ghost" className="p-2 text-gray-400 hover:text-primary"&gt;
            &lt;ApperIcon name="Edit" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
          &lt;Button variant="ghost" onClick={() => onDelete(assignment.id)} className="p-2 text-gray-400 hover:text-red-500"&gt;
            &lt;ApperIcon name="Trash2" className="w-4 h-4" /&gt;
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between"&gt;
        &lt;Text type="p" className="text-xs text-gray-500"&gt;
          Created {new Date(assignment.createdAt).toLocaleDateString()}
        &lt;/Text&gt;
        &lt;Button variant="link" onClick={() => onNotify(assignment.id)} className="text-sm flex items-center space-x-1"&gt;
          &lt;ApperIcon name="Bell" className="w-4 h-4" /&gt;
          &lt;Text type="span"&gt;Notify Students&lt;/Text&gt;
        &lt;/Button&gt;
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default AssignmentCard;