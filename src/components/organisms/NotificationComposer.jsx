import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import notificationService from '@/services/api/notificationService';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Text from '@/components/atoms/Text';

const NotificationComposer = ({ isOpen, onClose, onNotificationSent, classes, students, assignments }) => {
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
    // Reset form when modal opens
    if (isOpen) {
      setNewNotification({
        type: 'announcement',
        subject: '',
        message: '',
        selectedClassIds: [],
        selectedStudentIds: [],
        assignmentId: ''
      });
    }
  }, [isOpen]);

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

      const selectedStudentIds = new Set(prev.selectedStudentIds);
      
      if (isSelected) {
        classData.studentIds.forEach(studentId => {
          // Only remove if this student is not part of any other selected class
          const isStillInOtherSelectedClass = newSelectedClassIds.some(
            otherClassId => otherClassId !== classId && classes.find(c => c.id === otherClassId)?.studentIds.includes(studentId)
          );
          if (!isStillInOtherSelectedClass) {
            selectedStudentIds.delete(studentId);
          }
        });
      } else {
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
        sentAt: new Date().toISOString(), // Add sentAt time for consistency
        status: 'sent'
      });

      onNotificationSent(notification);
      onClose();
      toast.success(`Notification sent to ${newNotification.selectedStudentIds.length} students`);
    } catch (err) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    &lt;Modal isOpen={isOpen} onClose={onClose} title="Compose Notification" className="max-w-2xl"&gt;
      &lt;form onSubmit={handleSendNotification} className="space-y-6"&gt;
        {/* Template Selection */}
        &lt;div&gt;
          &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
            Notification Type
          &lt;/label&gt;
          &lt;div className="grid grid-cols-3 gap-3"&gt;
            {Object.entries(notificationTemplates).map(([type, template]) => (
              &lt;Button
                key={type}
                type="button"
                onClick={() => handleTemplateSelect(type)}
                className={`p-3 border text-center transition-all ${
                  newNotification.type === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                variant="ghost" // Use ghost variant to override default Button styles
                // Manually apply internal styling because Button atom does not expose all style props easily
                // This is a trade-off for atomic design (atoms are too generic for specific style needs)
                style={{ backgroundColor: newNotification.type === type ? 'var(--color-primary-10)' : '', borderColor: newNotification.type === type ? 'var(--color-primary)' : '' }}
                className="flex flex-col items-center justify-center !p-3 !text-center" // Override button padding/flex
              &gt;
                &lt;ApperIcon 
                  name={type === 'assignment' ? 'FileText' : type === 'reminder' ? 'Clock' : 'Bell'} 
                  className="w-5 h-5 mx-auto mb-1" 
                /&gt;
                &lt;Text type="div" className="text-sm font-medium capitalize"&gt;{type}&lt;/Text&gt;
              &lt;/Button&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Subject */}
        &lt;FormField label="Subject" required&gt;
          &lt;Input
            type="text"
            value={newNotification.subject}
            onChange={(e) => setNewNotification(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter notification subject"
            required
          /&gt;
        &lt;/FormField&gt;

        {/* Message */}
        &lt;FormField label="Message" required&gt;
          &lt;TextArea
            value={newNotification.message}
            onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Enter your message"
            rows="4"
            required
          /&gt;
        &lt;/FormField&gt;

        {/* Class Selection */}
        &lt;div&gt;
          &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
            Select Classes
          &lt;/label&gt;
          &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto"&gt;
            {classes.map(classItem => (
              &lt;label key={classItem.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"&gt;
                &lt;Checkbox
                  checked={newNotification.selectedClassIds.includes(classItem.id)}
                  onChange={() => handleClassSelect(classItem.id)}
                /&gt;
                &lt;Text type="span" className="text-sm text-gray-700 truncate"&gt;
                  {classItem.name} - {classItem.subject} ({classItem.studentIds.length} students)
                &lt;/Text&gt;
              &lt;/label&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Selected Recipients Count */}
        {newNotification.selectedStudentIds.length > 0 && (
          &lt;div className="bg-blue-50 p-3 rounded-lg"&gt;
            &lt;Text type="p" className="text-sm text-blue-700"&gt;
              &lt;ApperIcon name="Users" className="w-4 h-4 inline mr-1" /&gt;
              {newNotification.selectedStudentIds.length} students selected
            &lt;/Text&gt;
          &lt;/div&gt;
        )}

        {/* Action Buttons */}
        &lt;div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200"&gt;
          &lt;Button
            type="button"
            variant="ghost"
            onClick={onClose}
          &gt;
            Cancel
          &lt;/Button&gt;
          &lt;Button
            type="submit"
            variant="primary"
            loading={sending}
            disabled={sending || newNotification.selectedStudentIds.length === 0}
            icon="Send"
          &gt;
            {sending ? 'Sending...' : 'Send Notification'}
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/Modal&gt;
  );
};

export default NotificationComposer;