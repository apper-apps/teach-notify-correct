import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import studentService from '../services/api/studentService';
import classService from '../services/api/classService';

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    selectedClassIds: []
  });
  const [adding, setAdding] = useState(false);
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

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setAdding(true);
    try {
      const createdStudent = await studentService.create({
        name: newStudent.name.trim(),
        email: newStudent.email.trim(),
        classIds: newStudent.selectedClassIds
      });

      // Update classes to include this student
      for (const classId of newStudent.selectedClassIds) {
        const classData = classes.find(c => c.id === classId);
        if (classData) {
          await classService.update(classId, {
            ...classData,
            studentIds: [...classData.studentIds, createdStudent.id]
          });
        }
      }

      setStudents(prev => [...prev, createdStudent]);
      setNewStudent({ name: '', email: '', selectedClassIds: [] });
      setShowAddModal(false);
      toast.success('Student added successfully');
    } catch (err) {
      toast.error('Failed to add student');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
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

  const getStudentClasses = (student) => {
    return classes.filter(c => student.classIds.includes(c.id));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load students</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage your student roster</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span>Delete ({selectedStudents.length})</span>
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Student</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{filteredStudents.length} students</span>
          {selectedStudents.length > 0 && (
            <span className="text-primary">• {selectedStudents.length} selected</span>
          )}
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first student'
            }
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Student
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Select All</span>
              </label>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student, index) => {
              const studentClasses = getStudentClasses(student);
              
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
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
                              <span className="text-xs text-gray-500">
                                +{studentClasses.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-gray-900">Add New Student</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Classes
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {classes.map(classItem => (
                    <label key={classItem.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newStudent.selectedClassIds.includes(classItem.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewStudent(prev => ({
                              ...prev,
                              selectedClassIds: [...prev.selectedClassIds, classItem.id]
                            }));
                          } else {
                            setNewStudent(prev => ({
                              ...prev,
                              selectedClassIds: prev.selectedClassIds.filter(id => id !== classItem.id)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        {classItem.name} - {classItem.subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={adding}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {adding && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                  <span>{adding ? 'Adding...' : 'Add Student'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Students;