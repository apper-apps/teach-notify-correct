import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import classService from '@/services/api/classService';
import studentService from '@/services/api/studentService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import CreateClassForm from '@/components/organisms/CreateClassForm';
import ClassList from '@/components/organisms/ClassList';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // Keep students for student count functionality
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [classesData, studentsData] = await Promise.all([
          classService.getAll(),
          studentService.getAll()
        ]);
        setClasses(classesData);
        setStudents(studentsData);
      } catch (err) {
        setError(err.message || 'Failed to load classes');
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleClassCreated = (newClass) => {
    setClasses(prev => [...prev, newClass]);
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      await classService.delete(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
      toast.success('Class deleted successfully');
    } catch (err) {
      toast.error('Failed to delete class');
    }
  };

  const getStudentCount = (classId) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.studentIds.length : 0;
  };

if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <Heading level={3} className="text-lg font-medium">Failed to load classes</Heading>
          <Text type="p" className="text-gray-500 mb-4">{error}</Text>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Heading level={1} className="text-2xl font-bold">Classes</Heading>
          <Text type="p" className="text-gray-600">Manage your classes and students</Text>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
        >
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      <ClassList 
        classes={classes} 
        getStudentCount={getStudentCount} 
        onDeleteClass={handleDeleteClass} 
        onAddClassClick={() => setShowCreateModal(true)}
      />

      {/* Create Class Modal */}
      <CreateClassForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClassCreated={handleClassCreated}
      />
    </div>
  );
}

export default ClassesPage;

export default ClassesPage;