import { motion } from 'framer-motion';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import Heading from '@/components/atoms/Heading';
import Card from '@/components/molecules/Card';

const DashboardQuickActions = ({ actions }) => {
  return (
    &lt;Card animate delay={0.5}&gt;
      &lt;Heading level={2} className="text-lg font-semibold mb-4"&gt;Quick Actions&lt;/Heading&gt;
      &lt;div className="space-y-3"&gt;
        {actions.map((action) => (
          &lt;QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.action}
          /&gt;
        ))}
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default DashboardQuickActions;