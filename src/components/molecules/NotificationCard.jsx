import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const NotificationCard = ({ notification, getAssignmentTitle, delay = 0 }) => {
  const typeClasses = {
    assignment: 'bg-accent/10 text-accent',
    reminder: 'bg-warning/10 text-warning',
    announcement: 'bg-info/10 text-info',
    default: 'bg-gray-100 text-gray-600'
  };

  const statusClasses = {
    sent: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    default: 'bg-gray-100 text-gray-600'
  };

  return (
    &lt;Card animate delay={delay}&gt;
      &lt;div className="flex items-start justify-between mb-4"&gt;
        &lt;div className="flex-1 min-w-0"&gt;
          &lt;div className="flex items-center space-x-3 mb-2"&gt;
            &lt;Heading level={3} className="text-lg font-semibold truncate"&gt;
              {notification.subject}
            &lt;/Heading&gt;
            &lt;span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[notification.type] || typeClasses.default}`} &gt;
              {notification.type}
            &lt;/span&gt;
            &lt;span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[notification.status] || statusClasses.default}`} &gt;
              {notification.status}
            &lt;/span&gt;
          &lt;/div&gt;
          
          &lt;Text type="p" className="text-gray-600 text-sm mb-3 break-words"&gt;
            {notification.message}
          &lt;/Text&gt;

          &lt;div className="flex items-center space-x-4 text-sm text-gray-500"&gt;
            &lt;div className="flex items-center space-x-1"&gt;
              &lt;ApperIcon name="Users" className="w-4 h-4" /&gt;
              &lt;Text type="span"&gt;{notification.recipientIds.length} recipients&lt;/Text&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center space-x-1"&gt;
              &lt;ApperIcon name="Clock" className="w-4 h-4" /&gt;
              &lt;Text type="span"&gt;{new Date(notification.sentAt).toLocaleString()}&lt;/Text&gt;
            &lt;/div&gt;
            {notification.assignmentId && (
              &lt;div className="flex items-center space-x-1"&gt;
                &lt;ApperIcon name="FileText" className="w-4 h-4" /&gt;
                &lt;Text type="span"&gt;{getAssignmentTitle(notification.assignmentId)}&lt;/Text&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default NotificationCard;