import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import notificationService from '@/services/api/notificationService';
import classService from '@/services/api/classService';
import studentService from '@/services/api/studentService';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';
import Checkbox from '@/components/atoms/Checkbox';

function QuickNotifySection() {
  const [quickNotification, setQuickNotification] = useState({
    type: 'announcement',
    subject: '',
    message: '',
    selectedClassIds: []
  });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // Needed for calculating recipient count
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
    &lt;Card animate delay={0.7}&gt;
      &lt;div className="flex items-center justify-between mb-4"&gt;
        &lt;Heading level={2} className="text-lg font-semibold"&gt;Quick Notify&lt;/Heading&gt;
        &lt;Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400 hover:text-gray-600"&gt;
          &lt;ApperIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5" /&gt;
        &lt;/Button&gt;
      &lt;/div&gt;

      {!isExpanded ? (
        &lt;div className="space-y-3"&gt;
          &lt;Text type="p" className="text-sm text-gray-600 mb-4"&gt;Send quick notifications using templates&lt;/Text&gt;
          &lt;div className="grid grid-cols-1 sm:grid-cols-3 gap-3"&gt;
            {quickTemplates.map((template) => (
              &lt;motion.button
                key={template.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateSelect(template)}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
              &gt;
                &lt;div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center`}&gt;
                  &lt;ApperIcon name={template.icon} className="w-5 h-5 text-white" /&gt;
                &lt;/div&gt;
                &lt;div className="flex-1 min-w-0"&gt;
                  &lt;Heading level={3} className="font-medium text-gray-900 capitalize text-base"&gt;{template.type}&lt;/Heading&gt;
                  &lt;Text type="p" className="text-xs text-gray-500 truncate"&gt;{template.subject}&lt;/Text&gt;
                &lt;/div&gt;
              &lt;/motion.button&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;
      ) : (
        &lt;motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        &gt;
          {/* Subject */}
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Subject&lt;/label&gt;
            &lt;Input
              type="text"
              value={quickNotification.subject}
              onChange={(e) => setQuickNotification(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter notification subject"
              className="text-sm"
            /&gt;
          &lt;/div&gt;

          {/* Message */}
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;Message&lt;/label&gt;
            &lt;TextArea
              value={quickNotification.message}
              onChange={(e) => setQuickNotification(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your message"
              rows="3"
              className="text-sm"
            /&gt;
          &lt;/div&gt;

          {/* Class Selection */}
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;Select Classes&lt;/label&gt;
            &lt;div className="space-y-2 max-h-32 overflow-y-auto"&gt;
              {classes.map(classItem => (
                &lt;label key={classItem.id} className="flex items-center space-x-2 text-sm"&gt;
                  &lt;Checkbox
                    checked={quickNotification.selectedClassIds.includes(classItem.id)}
                    onChange={() => handleClassToggle(classItem.id)}
                  /&gt;
                  &lt;Text type="span" className="text-gray-700 truncate"&gt;
                    {classItem.name} - {classItem.subject} ({classItem.studentIds.length} students)
                  &lt;/Text&gt;
                &lt;/label&gt;
              ))}
            &lt;/div&gt;
          &lt;/div&gt;

          {/* Selected Count */}
          {quickNotification.selectedClassIds.length > 0 && (
            &lt;div className="bg-blue-50 p-3 rounded-lg"&gt;
              &lt;Text type="p" className="text-sm text-blue-700"&gt;
                &lt;ApperIcon name="Users" className="w-4 h-4 inline mr-1" /&gt;
                {getSelectedStudentIds().length} students will receive this notification
              &lt;/Text&gt;
            &lt;/div&gt;
          )}

          {/* Actions */}
          &lt;div className="flex items-center justify-end space-x-3 pt-2"&gt;
            &lt;Button variant="ghost" onClick={() => setIsExpanded(false)} className="text-sm"&gt;
              Cancel
            &lt;/Button&gt;
            &lt;Button
              variant="primary"
              onClick={handleQuickSend}
              loading={sending}
              disabled={quickNotification.selectedClassIds.length === 0}
              icon="Send"
              className="text-sm"
            &gt;
              {sending ? 'Sending...' : 'Send Now'}
            &lt;/Button&gt;
          &lt;/div&gt;
        &lt;/motion.div&gt;
      )}
    &lt;/Card&gt;
  );
}

export default QuickNotifySection;