import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import NotificationCard from '@/components/molecules/NotificationCard';

const NotificationHistory = ({ notifications, getAssignmentTitle, onComposeNotificationClick }) => {
  if (notifications.length === 0) {
    return (
      &lt;motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      &gt;
        &lt;motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        &gt;
          &lt;ApperIcon name="Bell" className="w-16 h-16 text-gray-300 mx-auto" /&gt;
        &lt;/motion.div&gt;
        &lt;Heading level={3} className="mt-4 text-lg font-medium"&gt;No notifications sent yet&lt;/Heading&gt;
        &lt;Text type="p" className="mt-2 text-gray-500"&gt;Start communicating with your students by sending your first notification&lt;/Text&gt;
        &lt;Button variant="primary" onClick={onComposeNotificationClick} className="mt-4"&gt;
          Send Notification
        &lt;/Button&gt;
      &lt;/motion.div&gt;
    );
  }

  return (
    &lt;div className="space-y-4"&gt;
      {notifications.map((notification, index) => (
        &lt;NotificationCard
          key={notification.id}
          notification={notification}
          getAssignmentTitle={getAssignmentTitle}
          delay={index * 0.1}
        /&gt;
      ))}
    &lt;/div&gt;
  );
};

export default NotificationHistory;