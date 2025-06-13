import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const ClassCard = ({ classItem, studentCount, onDelete, delay = 0 }) => {
  return (
<Card animate delay={delay} whileHover={{ scale: 1.02 }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Heading level={3} className="text-lg font-semibold truncate">
            {classItem.name}
          </Heading>
          <Text type="p" className="text-sm text-gray-600 truncate">{classItem.subject}</Text>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" onClick={() => onDelete(classItem.id)} className="p-1 text-gray-400 hover:text-red-500">
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
          <Text type="span" className="text-sm text-gray-600">
            {studentCount} students
          </Text>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" className="p-2 text-gray-400 hover:text-primary">
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="p-2 text-gray-400 hover:text-secondary">
            <ApperIcon name="Bell" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Text type="p" className="text-xs text-gray-500">
          Created {new Date(classItem.createdAt).toLocaleDateString()}
        </Text>
      </div>
    </Card>
};

export default ClassCard;