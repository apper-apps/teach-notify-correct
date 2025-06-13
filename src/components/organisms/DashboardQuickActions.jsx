import { motion } from 'framer-motion';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import Heading from '@/components/atoms/Heading';
import Card from '@/components/molecules/Card';

const DashboardQuickActions = ({ actions }) => {
  return (
    <Card animate delay={0.5}>
      <Heading level={2} className="text-lg font-semibold mb-4">Quick Actions</Heading>
      <div className="space-y-3">
        {actions.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.action}
          />
        ))}
      </div>
    </Card>
  );
};

export default DashboardQuickActions;