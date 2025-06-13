import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import notificationService from '../services/api/notificationService';
import classService from '../services/api/classService';
import studentService from '../services/api/studentService';
import assignmentService from '../services/api/assignmentService';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'announcement',
    subject: '',
    message: '',
    selectedClassIds: [],
    selectedStudentIds: [],
    assignmentId: ''
  });
  const [sending, setSending] = useState(false);

  const notificationTemplates = {
    assignment: {
      subject: 'New Assignment Posted',
      message: 'A new assignment has been posted for your class. Please check the details and due date.'
    },
    announcement: {
      subject: 'Class Announcement',
      message: 'Important information for your class.'
    },
    reminder: {
      subject: 'Assignment Reminder',
      message: 'This is a reminder about your upcoming assignment due date.'
    }
  };

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
        setNotifications(notificationsData);
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

  const handleTemplateSelect = (templateType) => {
    const template = notificationTemplates[templateType];
    setNewNotification(prev => ({
      ...prev,
      type: templateType,
      subject: template.subject,
      message: template.message
    }));
  };

  const handleClassSelect = (classId) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return;

    setNewNotification(prev => {
      const isSelected = prev.selectedClassIds.includes(classId);
      const newSelectedClassIds = isSelected
        ? prev.selectedClassIds.filter(id => id !== classId)
        : [...prev.selectedClassIds, classId];

      // Auto-select students from selected classes
      const selectedStudentIds = new Set(prev.selectedStudentIds);
      
      if (isSelected) {
        // Remove students from this class
        classData.studentIds.forEach(studentId => {
          selectedStudentIds.delete(studentId);
        });
      } else {
        // Add students from this class
        classData.studentIds.forEach(studentId => {
          selectedStudentIds.add(studentId);
        });
      }

      return {
        ...prev,
        selectedClassIds: newSelectedClassIds,
        selectedStudentIds: Array.from(selectedStudentIds)
      };
    });
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!newNotification.subject.trim() || !newNotification.message.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    if (newNotification.selectedStudentIds.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    setSending(true);
    try {
      const notification = await notificationService.create({
        type: newNotification.type,
        subject: newNotification.subject.trim(),
        message: newNotification.message.trim(),
        recipientIds: newNotification.selectedStudentIds,
        assignmentId: newNotification.assignmentId || null,
        status: 'sent'
      });

      setNotifications(prev => [notification, ...prev]);
      setNewNotification({
        type: 'announcement',
        subject: '',
        message: '',
        selectedClassIds: [],
        selectedStudentIds: [],
        assignmentId: ''
      });
      setShowComposer(false);
      toast.success(`Notification sent to ${newNotification.selectedStudentIds.length} students`);
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getClassName = (classId) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : 'Unknown Class';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    return assignment ? assignment.title : 'Unknown Assignment';
  };

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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load notifications</h3>
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
          <h1 className="text-2xl font-heading font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Send notifications to students and view history</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComposer(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Send" className="w-4 h-4" />
          <span>Compose</span>
        </motion.button>
      </div>

      {/* Notification History */}
      {notifications.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Bell" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications sent yet</h3>
          <p className="mt-2 text-gray-500">Start communicating with your students by sending your first notification</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComposer(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Send Notification
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-heading font-semibold text-gray-900 truncate">
                      {notification.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.type === 'assignment' ? 'bg-accent/10 text-accent' :
                      notification.type === 'reminder' ? 'bg-warning/10 text-warning' :
                      'bg-info/10 text-info'
                    }`}>
                      {notification.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.status === 'sent' ? 'bg-success/10 text-success' :
                      notification.status === 'pending' ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 break-words">
                    {notification.message}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Users" className="w-4 h-4" />
                      <span>{notification.recipientIds.length} recipients</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>{new Date(notification.sentAt).toLocaleString()}</span>
                    </div>
                    {notification.assignmentId && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="FileText" className="w-4 h-4" />
                        <span>{getAssignmentTitle(notification.assignmentId)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Notification Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900">Compose Notification</h2>
              <button
                onClick={() => setShowComposer(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(notificationTemplates).map(([type, template]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTemplateSelect(type)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        newNotification.type === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ApperIcon 
                        name={type === 'assignment' ? 'FileText' : type === 'reminder' ? 'Clock' : 'Bell'} 
                        className="w-5 h-5 mx-auto mb-1" 
                      />
                      <div className="text-sm font-medium capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newNotification.subject}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter notification subject"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your message"
                  rows="4"
                  required
                />
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Classes
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {classes.map(classItem => (
                    <label key={classItem.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={newNotification.selectedClassIds.includes(classItem.id)}
                        onChange={() => handleClassSelect(classItem.id)}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {classItem.name} - {classItem.subject} ({classItem.studentIds.length} students)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Recipients Count */}
              {newNotification.selectedStudentIds.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <ApperIcon name="Users" className="w-4 h-4 inline mr-1" />
                    {newNotification.selectedStudentIds.length} students selected
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={sending || newNotification.selectedStudentIds.length === 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {sending && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
                  <ApperIcon name="Send" className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Notification'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Notifications;