import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

function NotFoundPage() {
  const navigate = useNavigate();

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-8"
          >
            <ApperIcon name="AlertCircle" className="w-24 h-24 text-gray-300 mx-auto" />
          </motion.div>
          
          <Heading level={1} className="text-6xl font-bold mb-4">404</Heading>
          <Heading level={2} className="text-2xl font-semibold mb-4">Page Not Found</Heading>
          <Text type="p" className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              icon="Home"
              className="w-full px-6 py-3"
            >
              Go to Dashboard
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              icon="ArrowLeft"
              className="w-full px-6 py-3"
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFoundPage;
}

export default NotFoundPage;