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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="GraduationCap" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <Heading level={3} className="mt-4 text-lg font-medium">
          {searchTerm ? 'No students found' : 'No students yet'}
        </Heading>
        <Text type="p" className="mt-2 text-gray-500">
          {searchTerm 
            ? 'Try adjusting your search terms'
            : 'Get started by adding your first student'
          }
        </Text>
        {!searchTerm && (
          <Button variant="primary" onClick={onAddStudentClick} className="mt-4">
            Add Student
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onChange={onSelectAll} />
            <Text type="span" className="text-sm font-medium text-gray-700">Select All</Text>
          </label>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {filteredStudents.map((student, index) => (
          <StudentListItem
            key={student.id}
            student={student}
            studentClasses={getStudentClasses(student)}
            isSelected={selectedStudents.includes(student.id)}
            onSelect={onSelectStudent}
            onDelete={onDeleteStudent}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentTable;