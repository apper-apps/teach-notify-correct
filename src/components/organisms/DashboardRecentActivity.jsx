import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ActivityListItem from '@/components/molecules/ActivityListItem';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const DashboardRecentActivity = ({ recentActivity }) => {
  return (
    &lt;Card animate delay={0.6}&gt;
      &lt;Heading level={2} className="text-lg font-semibold mb-4"&gt;Recent Activity&lt;/Heading&gt;
      {recentActivity.length === 0 ? (
        &lt;div className="text-center py-8"&gt;
          &lt;ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-3" /&gt;
          &lt;Text type="p" className="text-gray-500"&gt;No recent activity&lt;/Text&gt;
        &lt;/div&gt;
      ) : (
        &lt;div className="space-y-4"&gt;
          {recentActivity.map((activity, index) => (
            &lt;ActivityListItem key={activity.id} activity={activity} delay={0.7 + index * 0.1} /&gt;
          ))}
        &lt;/div&gt;
      )}
    &lt;/Card&gt;
  );
};

export default DashboardRecentActivity;