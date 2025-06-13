import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import classService from '@/services/api/classService';
import assignmentService from '@/services/api/assignmentService';
import notificationService from '@/services/api/notificationService';
import studentService from '@/services/api/studentService';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import DashboardStatsSection from '@/components/organisms/DashboardStatsSection';
import DashboardQuickActions from '@/components/organisms/DashboardQuickActions';
import DashboardRecentActivity from '@/components/organisms/DashboardRecentActivity';
import QuickNotifySection from '@/components/organisms/QuickNotifySection'; // Renamed MainFeature

function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    recentNotifications: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [classes, students, assignments, notifications] = await Promise.all([
          classService.getAll(),
          studentService.getAll(),
          assignmentService.getAll(),
          notificationService.getAll()
        ]);

        setStats({
          totalClasses: classes.length,
          totalStudents: students.length,
          pendingAssignments: assignments.filter(a => new Date(a.dueDate) > new Date()).length,
          recentNotifications: notifications.filter(n => 
            new Date(n.sentAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        });

        // Create recent activity from notifications and assignments
        const activity = [
          ...notifications.slice(0, 3).map(n => ({
            id: n.id,
            type: 'notification',
            title: n.subject,
            description: `Sent to ${n.recipientIds.length} students`,
            time: n.sentAt,
            status: n.status
          })),
          ...assignments.slice(0, 2).map(a => ({
            id: a.id,
            type: 'assignment',
            title: a.title,
            description: `Due ${new Date(a.dueDate).toLocaleDateString()}`,
            time: a.createdAt,
            status: 'active'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        setRecentActivity(activity);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      id: 'create-assignment',
      title: 'Create Assignment',
      description: 'Add new assignment for your classes',
      icon: 'Plus',
      color: 'bg-primary',
      action: () => navigate('/assignments')
    },
    {
      id: 'send-notification',
      title: 'Send Notification',
      description: 'Notify students about updates',
      icon: 'Bell',
      color: 'bg-secondary',
      action: () => navigate('/notifications')
    },
    {
      id: 'manage-classes',
      title: 'Manage Classes',
      description: 'View and organize your classes',
      icon: 'Users',
      color: 'bg-accent',
      action: () => navigate('/classes')
    }
  ];

  if (loading) {
    return (
      &lt;div className="p-6 space-y-6"&gt;
        &lt;div className="animate-pulse"&gt;
          &lt;div className="h-8 bg-gray-200 rounded w-1/4 mb-6"&gt;&lt;/div&gt;
          &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"&gt;
            {[...Array(4)].map((_, i) => (
              &lt;div key={i} className="bg-white p-6 rounded-lg shadow-sm"&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-1/2 mb-4"&gt;&lt;/div&gt;
                &lt;div className="h-8 bg-gray-200 rounded w-1/3"&gt;&lt;/div&gt;
              &lt;/div&gt;
            ))}
          &lt;/div&gt;
          &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6"&gt;
            &lt;div className="bg-white p-6 rounded-lg shadow-sm"&gt;
              &lt;div className="h-6 bg-gray-200 rounded w-1/3 mb-4"&gt;&lt;/div&gt;
              &lt;div className="space-y-4"&gt;
                {[...Array(3)].map((_, i) => (
                  &lt;div key={i} className="h-16 bg-gray-100 rounded"&gt;&lt;/div&gt;
                ))}
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="bg-white p-6 rounded-lg shadow-sm"&gt;
              &lt;div className="h-6 bg-gray-200 rounded w-1/3 mb-4"&gt;&lt;/div&gt;
              &lt;div className="space-y-4"&gt;
                {[...Array(3)].map((_, i) => (
                  &lt;div key={i} className="h-20 bg-gray-100 rounded"&gt;&lt;/div&gt;
                ))}
              &lt;/div&gt;
            &lt;/div&gt;
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
          &lt;Heading level={3} className="text-lg font-medium"&gt;Failed to load dashboard&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-500 mb-4"&gt;{error}&lt;/Text&gt;
          &lt;Button variant="primary" onClick={() => window.location.reload()}&gt;
            Try Again
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;div className="p-6 space-y-6 max-w-full"&gt;
      {/* Header */}
      &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"&gt;
        &lt;div&gt;
          &lt;Heading level={1} className="text-2xl font-bold"&gt;Dashboard&lt;/Heading&gt;
          &lt;Text type="p" className="text-gray-600"&gt;Welcome back! Here's what's happening with your classes.&lt;/Text&gt;
        &lt;/div&gt;
        &lt;Button
          variant="primary"
          onClick={() => navigate('/notifications')}
          icon="Plus"
        &gt;
          Quick Notify
        &lt;/Button&gt;
      &lt;/div&gt;

      &lt;DashboardStatsSection stats={stats} /&gt;

      &lt;div className="grid grid-cols-1 lg:grid-cols-2 gap-6"&gt;
        &lt;DashboardQuickActions actions={quickActions} /&gt;
        &lt;DashboardRecentActivity recentActivity={recentActivity} /&gt;
      &lt;/div&gt;

      &lt;QuickNotifySection /&gt;
    &lt;/div&gt;
  );
}

export default HomePage;