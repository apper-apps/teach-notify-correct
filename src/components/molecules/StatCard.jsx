import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatCard = ({ title, value, icon, iconBgColor, iconColor, delay = 0, ...props }) => {
  return (
    &lt;Card animate delay={delay} {...props}&gt;
      &lt;div className="flex items-center justify-between"&gt;
        &lt;div&gt;
          &lt;Text type="p" className="text-sm font-medium text-gray-600"&gt;{title}&lt;/Text&gt;
          &lt;Text type="p" className="text-2xl font-bold text-gray-900"&gt;{value}&lt;/Text&gt;
        &lt;/div&gt;
        &lt;div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}&gt;
          &lt;ApperIcon name={icon} className={`w-6 h-6 ${iconColor}`} /&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/Card&gt;
  );
};

export default StatCard;