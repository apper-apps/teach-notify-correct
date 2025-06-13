import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';

const StudentListItem = ({ student, studentClasses, isSelected, onSelect, onDelete, delay = 0 }) => {
return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox checked={isSelected} onChange={() => onSelect(student.id)} />
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <Text type="h3" className="text-sm font-medium text-gray-900">{student.name}</Text>
            <Text type="p" className="text-sm text-gray-500">{student.email}</Text>
            {studentClasses.length > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                {studentClasses.slice(0, 2).map(classItem => (
                  <span
                    key={classItem.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {classItem.name}
                  </span>
                ))}
                {studentClasses.length > 2 && (
                  <Text type="span" className="text-xs text-gray-500">
                    +{studentClasses.length - 2} more
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => onDelete(student.id)} className="p-2 text-gray-400 hover:text-red-500">
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentListItem;