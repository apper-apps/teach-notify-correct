import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import assignmentService from '../services/api/assignmentService';
import classService from '../services/api/classService';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: ''
  });
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [assignmentsData, classesData] = await Promise.all([
          assignmentService.getAll(),
          classService.getAll()
        ]);
        setAssignments(assignmentsData);
        setClasses(classesData);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.classId || !newAssignment.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const createdAssignment = await assignmentService.create({
        title: newAssignment.title.trim(),
        description: newAssignment.description.trim(),
        classId: newAssignment.classId,
        dueDate: newAssignment.dueDate,
        attachments: []
      });
      setAssignments(prev => [...prev, createdAssignment]);
      setNewAssignment({ title: '', description: '', classId: '', dueDate: '' });
      setShowCreateModal(false);
      toast.success('Assignment created successfully');
    } catch (err) {
      toast.error('Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast.success('Assignment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };

  const getClassName = (classId) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : 'Unknown Class';
  };

  const getFilteredAssignments = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return assignments.filter(a => new Date(a.dueDate) > now);
      case 'overdue':
        return assignments.filter(a => new Date(a.dueDate) < now);
      default:
        return assignments;
    }
  };

  const filteredAssignments = getFilteredAssignments();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load assignments</h3>
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Create and manage assignments for your classes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>New Assignment</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({assignments.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'upcoming' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming ({assignments.filter(a => new Date(a.dueDate) > new Date()).length})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'overdue' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Overdue ({assignments.filter(a => new Date(a.dueDate) < new Date()).length})
        </button>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? 'Get started by creating your first assignment'
              : 'Try adjusting your filter or create a new assignment'
            }
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Assignment
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment, index) => {
            const isOverdue = new Date(assignment.dueDate) < new Date();
            const dueDate = new Date(assignment.dueDate);
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-heading font-semibold text-gray-900 truncate">
                        {assignment.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isOverdue 
                          ? 'bg-error/10 text-error' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Users" className="w-4 h-4" />
                        <span>{getClassName(assignment.classId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Due {dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="text-gray-600 text-sm break-words">
                        {assignment.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Created {new Date(assignment.createdAt).toLocaleDateString()}
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center space-x-1">
                    <ApperIcon name="Bell" className="w-4 h-4" />
                    <span>Notify Students</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-gray-900">Create Assignment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class *
                </label>
                <select
                  value={newAssignment.classId}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, classId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(classItem => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} - {classItem.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter assignment description"
                  rows="3"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={creating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {creating && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                  <span>{creating ? 'Creating...' : 'Create Assignment'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Assignments;