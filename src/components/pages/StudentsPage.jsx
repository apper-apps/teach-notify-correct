import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import classService from '@/services/api/classService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import AddStudentForm from '@/components/organisms/AddStudentForm';
import StudentTable from '@/components/organisms/StudentTable';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentsData, classesData] = await Promise.all([
          studentService.getAll(),
          classService.getAll()
        ]);
        setStudents(studentsData);
        setClasses(classesData);
      } catch (err) {
        setError(err.message || 'Failed to load students');
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleClassesUpdated = (updatedClassList) => {
    setClasses(prev => {
      const newClassesMap = new Map(prev.map(c => [c.id, c]));
      updatedClassList.forEach(updatedClass => {
        newClassesMap.set(updatedClass.id, updatedClass);
      });
      return Array.from(newClassesMap.values());
    });
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setSelectedStudents(prev => prev.filter(id => id !== studentId)); // Also remove from selected
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) return;

    try {
      await Promise.all(selectedStudents.map(id => studentService.delete(id)));
      setStudents(prev => prev.filter(s => !selectedStudents.includes(s.id)));
      setSelectedStudents([]);
      toast.success(`${selectedStudents.length} students deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete students');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (loading) {
    return (
      &lt;div className="p-6"&gt;
        &lt;div className="animate-pulse"&gt;
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-6"&gt;&lt;/div&gt;
          &lt;div className="h-10 bg-gray-200 rounded w-full mb-6"&gt;&lt;/div&gt;
          &lt;div className="space-y-4"&gt;
            {[...Array(5)].map((_, i) => (
              &lt;div key={i} className="bg-white p-4 rounded-lg shadow-sm"&gt;
                &lt;div className="h-6 bg-gray-200 rounded w-1/2 mb-2"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-1/3"&gt;&lt;/div&gt;
              &lt;/div&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  }

  if (error) {
    return (
      &lt;div className="p-6"&gt;
        &lt;div className="text-center py-12"&gt;
          &lt;ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" /&gt;
          &lt;Heading level={3} className="text-lg font-medium"&gt;Failed to load students&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-500 mb-4"&gt;{error}&lt;/Text&gt;
          &lt;Button variant="primary" onClick={() => window.location.reload()}&gt;
            Try Again
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;div className="p-6 max-w-full"&gt;
      {/* Header */}
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"&gt;
        &lt;div&gt;
          &lt;Heading level={1} className="text-2xl font-bold"&gt;Students&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-600"&gt;Manage your student roster&lt;/Text&gt;
        &lt;/div&gt;
        &lt;div className="flex items-center space-x-3"&gt;
          {selectedStudents.length > 0 && (
            &lt;Button
              variant="danger"
              onClick={handleBulkDelete}
              icon="Trash2"
            &gt;
              Delete ({selectedStudents.length})
            &lt;/Button&gt;
          )}
          &lt;Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            icon="Plus"
          &gt;
            Add Student
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Search and Filters */}
      &lt;div className="flex flex-col sm:flex-row gap-4 mb-6"&gt;
        &lt;div className="flex-1"&gt;
          &lt;Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or email..."
            icon="Search"
          /&gt;
        &lt;/div&gt;
        &lt;div className="flex items-center space-x-2 text-sm text-gray-600"&gt;
          &lt;Text type="span"&gt;{filteredStudents.length} students&lt;/Text&gt;
          {selectedStudents.length > 0 && (
            &lt;Text type="span" className="text-primary"&gt;• {selectedStudents.length} selected&lt;/Text&gt;
          )}
        &lt;/div&gt;
      &lt;/div&gt;

      {/* Students List/Table */}
      &lt;StudentTable
        filteredStudents={filteredStudents}
        classes={classes}
        selectedStudents={selectedStudents}
        onSelectAll={handleSelectAll}
        onSelectStudent={handleSelectStudent}
        onDeleteStudent={handleDeleteStudent}
        onAddStudentClick={() => setShowAddModal(true)}
        searchTerm={searchTerm}
      /&gt;

      {/* Add Student Modal */}
      &lt;AddStudentForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStudentAdded={handleStudentAdded}
        classes={classes}
        onClassesUpdated={handleClassesUpdated} // Pass a callback to update parent's classes state
      /&gt;
    &lt;/div&gt;
  );
}

export default StudentsPage;