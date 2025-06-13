import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatCard = ({ title, value, icon, iconBgColor, iconColor, delay = 0, ...props }) => {
return (
    <Card animate delay={delay} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <Text type="p" className="text-sm font-medium text-gray-600">{title}</Text>
          <Text type="p" className="text-2xl font-bold text-gray-900">{value}</Text>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;