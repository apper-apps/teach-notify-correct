import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ActivityListItem from '@/components/molecules/ActivityListItem';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const DashboardRecentActivity = ({ recentActivity }) => {
return (
    <Card animate delay={0.6}>
      <Heading level={2} className="text-lg font-semibold mb-4">Recent Activity</Heading>
      {recentActivity.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <Text type="p" className="text-gray-500">No recent activity</Text>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <ActivityListItem key={activity.id} activity={activity} delay={0.7 + index * 0.1} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default DashboardRecentActivity;