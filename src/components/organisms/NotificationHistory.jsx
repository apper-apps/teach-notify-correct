import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import NotificationCard from '@/components/molecules/NotificationCard';

const NotificationHistory = ({ notifications, getAssignmentTitle, onComposeNotificationClick }) => {
  if (notifications.length === 0) {
return (
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
        <Heading level={3} className="mt-4 text-lg font-medium">No notifications sent yet</Heading>
        <Text type="p" className="mt-2 text-gray-500">Start communicating with your students by sending your first notification</Text>
        <Button variant="primary" onClick={onComposeNotificationClick} className="mt-4">
          Send Notification
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          getAssignmentTitle={getAssignmentTitle}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default NotificationHistory;