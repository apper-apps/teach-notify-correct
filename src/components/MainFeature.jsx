import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import notificationService from '../services/api/notificationService';
import classService from '../services/api/classService';
import studentService from '../services/api/studentService';

function MainFeature() {
  const [quickNotification, setQuickNotification] = useState({
    type: 'announcement',
    subject: '',
    message: '',
    selectedClassIds: []
  });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [sending, setSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classesData, studentsData] = await Promise.all([
          classService.getAll(),
          studentService.getAll()
        ]);
        setClasses(classesData);
        setStudents(studentsData);
      } catch (err) {
        console.error('Failed to load data for quick notification');
      }
    };

    loadData();
  }, []);

  const quickTemplates = [
    {
      type: 'assignment',
      subject: 'New Assignment Posted',
      message: 'A new assignment has been posted for your class. Please check the details and due date.',
      icon: 'FileText',
      color: 'bg-accent'
    },
    {
      type: 'reminder',
      subject: 'Assignment Due Tomorrow',
      message: 'This is a friendly reminder that your assignment is due tomorrow. Please submit on time.',
      icon: 'Clock',
      color: 'bg-warning'
    },
    {
      type: 'announcement',
      subject: 'Class Update',
      message: 'Important update regarding our class. Please read carefully.',
      icon: 'Bell',
      color: 'bg-info'
    }
  ];

  const handleTemplateSelect = (template) => {
    setQuickNotification(prev => ({
      ...prev,
      type: template.type,
      subject: template.subject,
      message: template.message
    }));
    setIsExpanded(true);
  };

  const handleClassToggle = (classId) => {
    setQuickNotification(prev => ({
      ...prev,
      selectedClassIds: prev.selectedClassIds.includes(classId)
        ? prev.selectedClassIds.filter(id => id !== classId)
        : [...prev.selectedClassIds, classId]
    }));
  };

  const getSelectedStudentIds = () => {
    const selectedStudentIds = new Set();
    quickNotification.selectedClassIds.forEach(classId => {
      const classData = classes.find(c => c.id === classId);
      if (classData) {
        classData.studentIds.forEach(studentId => {
          selectedStudentIds.add(studentId);
        });
      }
    });
    return Array.from(selectedStudentIds);
  };

  const handleQuickSend = async () => {
    if (!quickNotification.subject.trim() || !quickNotification.message.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    const recipientIds = getSelectedStudentIds();
    if (recipientIds.length === 0) {
      toast.error('Please select at least one class');
      return;
    }

    setSending(true);
    try {
      await notificationService.create({
        type: quickNotification.type,
        subject: quickNotification.subject.trim(),
        message: quickNotification.message.trim(),
        recipientIds,
        status: 'sent'
      });

      setQuickNotification({
        type: 'announcement',
        subject: '',
        message: '',
        selectedClassIds: []
      });
      setIsExpanded(false);
      toast.success(`Quick notification sent to ${recipientIds.length} students`);
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-gray-900">Quick Notify</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5" />
        </button>
      </div>

      {!isExpanded ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Send quick notifications using templates</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickTemplates.map((template) => (
              <motion.button
                key={template.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateSelect(template)}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={template.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 capitalize">{template.type}</h3>
                    <p className="text-xs text-gray-500 truncate">{template.subject}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={quickNotification.subject}
              onChange={(e) => setQuickNotification(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              placeholder="Enter notification subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={quickNotification.message}
              onChange={(e) => setQuickNotification(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
              placeholder="Enter your message"
              rows="3"
            />
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Classes</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {classes.map(classItem => (
                <label key={classItem.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={quickNotification.selectedClassIds.includes(classItem.id)}
                    onChange={() => handleClassToggle(classItem.id)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-gray-700 truncate">
                    {classItem.name} - {classItem.subject} ({classItem.studentIds.length} students)
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Count */}
          {quickNotification.selectedClassIds.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <ApperIcon name="Users" className="w-4 h-4 inline mr-1" />
                {getSelectedStudentIds().length} students will receive this notification
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickSend}
              disabled={sending || quickNotification.selectedClassIds.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
            >
              {sending && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
              <ApperIcon name="Send" className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send Now'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MainFeature;