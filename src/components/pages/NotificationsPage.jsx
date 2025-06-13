import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import notificationService from '@/services/api/notificationService';
import classService from '@/services/api/classService';
import studentService from '@/services/api/studentService';
import assignmentService from '@/services/api/assignmentService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import NotificationComposer from '@/components/organisms/NotificationComposer';
import NotificationHistory from '@/components/organisms/NotificationHistory';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notificationsData, classesData, studentsData, assignmentsData] = await Promise.all([
          notificationService.getAll(),
          classService.getAll(),
          studentService.getAll(),
          assignmentService.getAll()
        ]);
        setNotifications(notificationsData.sort((a,b) => new Date(b.sentAt) - new Date(a.sentAt))); // Sort by most recent
        setClasses(classesData);
        setStudents(studentsData);
        setAssignments(assignmentsData);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNotificationSent = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : 'Unknown Assignment';
  };

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
          &lt;Heading level={3} className="text-lg font-medium"&gt;Failed to load notifications&lt;/Heading&gt;
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
          &lt;Heading level={1} className="text-2xl font-bold"&gt;Notifications&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-600"&gt;Send notifications to students and view history&lt;/Text&gt;
        &lt;/div&gt;
        &lt;Button
          variant="primary"
          onClick={() => setShowComposer(true)}
          icon="Send"
        &gt;
          Compose
        &lt;/Button&gt;
      &lt;/div&gt;

      {/* Notification History */}
      &lt;NotificationHistory 
        notifications={notifications} 
        getAssignmentTitle={getAssignmentTitle} 
        onComposeNotificationClick={() => setShowComposer(true)}
      /&gt;

      {/* Notification Composer Modal */}
      &lt;NotificationComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onNotificationSent={handleNotificationSent}
        classes={classes}
        students={students}
        assignments={assignments}
      /&gt;
    &lt;/div&gt;
  );
}

export default NotificationsPage;