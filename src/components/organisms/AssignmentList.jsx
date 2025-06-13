import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AssignmentCard from '@/components/molecules/AssignmentCard';

const AssignmentList = ({ assignments, filter, getClassName, onDeleteAssignment, onNotifyStudents, onCreateAssignmentClick }) => {
  if (assignments.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="FileText" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <Heading level={3} className="mt-4 text-lg font-medium">
          {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
        </Heading>
        <Text type="p" className="mt-2 text-gray-500">
          {filter === 'all' 
            ? 'Get started by creating your first assignment'
            : 'Try adjusting your filter or create a new assignment'
          }
        </Text>
        {filter === 'all' && (
          <Button variant="primary" onClick={onCreateAssignmentClick} className="mt-4">
            Create Assignment
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment, index) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          className={getClassName(assignment.classId)}
          onDelete={onDeleteAssignment}
          onNotify={() => onNotifyStudents(assignment.id)}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default AssignmentList;