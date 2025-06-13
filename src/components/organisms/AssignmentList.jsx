import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AssignmentCard from '@/components/molecules/AssignmentCard';

const AssignmentList = ({ assignments, filter, getClassName, onDeleteAssignment, onNotifyStudents, onCreateAssignmentClick }) => {
  if (assignments.length === 0) {
    return (
      &lt;motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      &gt;
        &lt;motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        &gt;
          &lt;ApperIcon name="FileText" className="w-16 h-16 text-gray-300 mx-auto" /&gt;
        &lt;/motion.div&gt;
        &lt;Heading level={3} className="mt-4 text-lg font-medium"&gt;
          {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
        &lt;/Heading&gt;
        &lt;Text type="p" className="mt-2 text-gray-500"&gt;
          {filter === 'all' 
            ? 'Get started by creating your first assignment'
            : 'Try adjusting your filter or create a new assignment'
          }
        &lt;/Text&gt;
        {filter === 'all' && (
          &lt;Button variant="primary" onClick={onCreateAssignmentClick} className="mt-4"&gt;
            Create Assignment
          &lt;/Button&gt;
        )}
      &lt;/motion.div&gt;
    );
  }

  return (
    &lt;div className="space-y-4"&gt;
      {assignments.map((assignment, index) => (
        &lt;AssignmentCard
          key={assignment.id}
          assignment={assignment}
          className={getClassName(assignment.classId)}
          onDelete={onDeleteAssignment}
          onNotify={() => onNotifyStudents(assignment.id)}
          delay={index * 0.1}
        /&gt;
      ))}
    &lt;/div&gt;
  );
};

export default AssignmentList;