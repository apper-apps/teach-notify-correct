import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ClassCard from '@/components/molecules/ClassCard';

const ClassList = ({ classes, getStudentCount, onDeleteClass, onAddClassClick }) => {
  if (classes.length === 0) {
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
          &lt;ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" /&gt;
        &lt;/motion.div&gt;
        &lt;Heading level={3} className="mt-4 text-lg font-medium"&gt;No classes yet&lt;/Heading&gt;
        &lt;Text type="p" className="mt-2 text-gray-500"&gt;Get started by creating your first class&lt;/Text&gt;
        &lt;Button variant="primary" onClick={onAddClassClick} className="mt-4"&gt;
          Create Class
        &lt;/Button&gt;
      &lt;/motion.div&gt;
    );
  }

  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
      {classes.map((classItem, index) => (
        &lt;ClassCard
          key={classItem.id}
          classItem={classItem}
          studentCount={getStudentCount(classItem.id)}
          onDelete={onDeleteClass}
          delay={index * 0.1}
        /&gt;
      ))}
    &lt;/div&gt;
  );
};

export default ClassList;