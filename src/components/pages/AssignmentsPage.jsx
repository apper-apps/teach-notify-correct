import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import assignmentService from '@/services/api/assignmentService';
import classService from '@/services/api/classService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import CreateAssignmentForm from '@/components/organisms/CreateAssignmentForm';
import AssignmentList from '@/components/organisms/AssignmentList';

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
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

  const handleNotifyStudents = (assignmentId) => {
    // This could trigger a notification composer pre-filled for this assignment
    toast.info(`Functionality to notify students for assignment ${assignmentId} is not implemented.`);
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
      &lt;div className="p-6"&gt;
        &lt;div className="animate-pulse"&gt;
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-6"&gt;&lt;/div&gt;
          &lt;div className="space-y-4"&gt;
            {[...Array(5)].map((_, i) => (
              &lt;div key={i} className="bg-white p-6 rounded-lg shadow-sm"&gt;
                &lt;div className="h-6 bg-gray-200 rounded w-1/2 mb-4"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-3/4 mb-2"&gt;&lt;/div&gt;
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
          &lt;Heading level={3} className="text-lg font-medium"&gt;Failed to load assignments&lt;/Heading&gt;
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
          &lt;Heading level={1} className="text-2xl font-bold"&gt;Assignments&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-600"&gt;Create and manage assignments for your classes&lt;/Text&gt;
        &lt;/div&gt;
        &lt;Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
        &gt;
          New Assignment
        &lt;/Button&gt;
      &lt;/div&gt;

      {/* Filters */}
      &lt;div className="flex items-center space-x-2 mb-6"&gt;
        &lt;Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          onClick={() => setFilter('all')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        &gt;
          All ({assignments.length})
        &lt;/Button&gt;
        &lt;Button
          variant={filter === 'upcoming' ? 'primary' : 'ghost'}
          onClick={() => setFilter('upcoming')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        &gt;
          Upcoming ({assignments.filter(a => new Date(a.dueDate) > new Date()).length})
        &lt;/Button&gt;
        &lt;Button
          variant={filter === 'overdue' ? 'primary' : 'ghost'}
          onClick={() => setFilter('overdue')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        &gt;
          Overdue ({assignments.filter(a => new Date(a.dueDate) < new Date()).length})
        &lt;/Button&gt;
      &lt;/div&gt;

      {/* Assignments List */}
      &lt;AssignmentList
        assignments={filteredAssignments}
        filter={filter}
        getClassName={getClassName}
        onDeleteAssignment={handleDeleteAssignment}
        onNotifyStudents={handleNotifyStudents}
        onCreateAssignmentClick={() => setShowCreateModal(true)}
      /&gt;

      {/* Create Assignment Modal */}
      &lt;CreateAssignmentForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAssignmentCreated={handleAssignmentCreated}
        classes={classes}
      /&gt;
    &lt;/div&gt;
  );
}

export default AssignmentsPage;