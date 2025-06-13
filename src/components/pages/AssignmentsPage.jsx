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
          <Heading level={3} className="text-lg font-medium">Failed to load assignments</Heading>
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
          <Heading level={1} className="text-2xl font-bold">Assignments</Heading>
          <Text type="p" className="text-gray-600">Create and manage assignments for your classes</Text>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon="Plus"
        >
          New Assignment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          onClick={() => setFilter('all')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        >
          All ({assignments.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'ghost'}
          onClick={() => setFilter('upcoming')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        >
          Upcoming ({assignments.filter(a => new Date(a.dueDate) > new Date()).length})
        </Button>
        <Button
          variant={filter === 'overdue' ? 'primary' : 'ghost'}
          onClick={() => setFilter('overdue')}
          className="px-3 py-1 rounded-full text-sm font-medium"
        >
          Overdue ({assignments.filter(a => new Date(a.dueDate) < new Date()).length})
        </Button>
      </div>

      {/* Assignments List */}
      <AssignmentList
        assignments={filteredAssignments}
        filter={filter}
        getClassName={getClassName}
        onDeleteAssignment={handleDeleteAssignment}
        onNotifyStudents={handleNotifyStudents}
        onCreateAssignmentClick={() => setShowCreateModal(true)}
      />

      {/* Create Assignment Modal */}
      <CreateAssignmentForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAssignmentCreated={handleAssignmentCreated}
        classes={classes}
      />
    </div>
  );
  );
}

export default AssignmentsPage;