import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ActivityListItem = ({ activity, delay = 0 }) => {
  const iconName = activity.type === 'notification' ? 'Bell' : 'FileText';
  const iconColor = activity.type === 'notification' ? 'text-primary' : 'text-accent';
  const bgColor = activity.type === 'notification' ? 'bg-primary/10' : 'bg-accent/10';

  const statusClasses = {
    sent: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    active: 'bg-success/10 text-success',
    overdue: 'bg-error/10 text-error',
    default: 'bg-gray-100 text-gray-600'
  };

return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
        <ApperIcon name={iconName} className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <Text type="p" className="text-sm font-medium text-gray-900 truncate">{activity.title}</Text>
        <Text type="p" className="text-xs text-gray-500 truncate">{activity.description}</Text>
        <Text type="p" className="text-xs text-gray-400 mt-1">
          {new Date(activity.time).toLocaleDateString()}
        </Text>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[activity.status] || statusClasses.default}`}>
        {activity.status}
      </div>
    </motion.div>
  );
};

export default ActivityListItem;