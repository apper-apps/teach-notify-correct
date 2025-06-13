import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import StudentListItem from '@/components/molecules/StudentListItem';

const StudentTable = ({ filteredStudents, classes, selectedStudents, onSelectAll, onSelectStudent, onDeleteStudent, onAddStudentClick, searchTerm }) => {
  const getStudentClasses = (student) => {
    return classes.filter(c => student.classIds.includes(c.id));
  };

  if (filteredStudents.length === 0) {
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
          &lt;ApperIcon name="GraduationCap" className="w-16 h-16 text-gray-300 mx-auto" /&gt;
        &lt;/motion.div&gt;
        &lt;Heading level={3} className="mt-4 text-lg font-medium"&gt;
          {searchTerm ? 'No students found' : 'No students yet'}
        &lt;/Heading&gt;
        &lt;Text type="p" className="mt-2 text-gray-500"&gt;
          {searchTerm 
            ? 'Try adjusting your search terms'
            : 'Get started by adding your first student'
          }
        &lt;/Text&gt;
        {!searchTerm && (
          &lt;Button variant="primary" onClick={onAddStudentClick} className="mt-4"&gt;
            Add Student
          &lt;/Button&gt;
        )}
      &lt;/motion.div&gt;
    );
  }

  return (
    &lt;div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"&gt;
      {/* Table Header */}
      &lt;div className="px-6 py-3 bg-gray-50 border-b border-gray-200"&gt;
        &lt;div className="flex items-center"&gt;
          &lt;label className="flex items-center space-x-2"&gt;
            &lt;Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onChange={onSelectAll} /&gt;
            &lt;Text type="span" className="text-sm font-medium text-gray-700"&gt;Select All&lt;/Text&gt;
          &lt;/label&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Table Body */}
      &lt;div className="divide-y divide-gray-200"&gt;
        {filteredStudents.map((student, index) => (
          &lt;StudentListItem
            key={student.id}
            student={student}
            studentClasses={getStudentClasses(student)}
            isSelected={selectedStudents.includes(student.id)}
            onSelect={onSelectStudent}
            onDelete={onDeleteStudent}
            delay={index * 0.05}
          /&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default StudentTable;