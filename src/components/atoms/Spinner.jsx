import ApperIcon from '@/components/ApperIcon';

const Spinner = ({ className = 'w-6 h-6 text-primary' }) => {
  return &lt;ApperIcon name="Loader2" className={`animate-spin ${className}`} /&gt;;
};

export default Spinner;