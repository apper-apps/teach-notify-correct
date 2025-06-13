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
    <Card animate delay={delay} className="hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <Heading level={3} className="text-lg font-semibold truncate">
              {assignment.title}
            </Heading>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`} >
              {isOverdue ? 'Overdue' : 'Active'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {className && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Users" className="w-4 h-4" />
                <Text type="span">{className}</Text>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <Text type="span">Due {dueDate.toLocaleDateString()}</Text>
            </div>
          </div>

          {assignment.description && (
            <Text type="p" className="text-gray-600 text-sm break-words">
              {assignment.description}
            </Text>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" className="p-2 text-gray-400 hover:text-primary">
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => onDelete(assignment.id)} className="p-2 text-gray-400 hover:text-red-500">
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <Text type="p" className="text-xs text-gray-500">
          Created {new Date(assignment.createdAt).toLocaleDateString()}
        </Text>
        <Button variant="link" onClick={() => onNotify(assignment.id)} className="text-sm flex items-center space-x-1">
          <ApperIcon name="Bell" className="w-4 h-4" />
          <Text type="span">Notify Students</Text>
        </Button>
      </div>
    </Card>
  );
};

export default AssignmentCard;