import StatCard from '@/components/molecules/StatCard';

const DashboardStatsSection = ({ stats }) => {
  return (
    &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"&gt;
      &lt;StatCard 
        title="Total Classes" 
        value={stats.totalClasses} 
        icon="Users" 
        iconBgColor="bg-primary/10" 
        iconColor="text-primary" 
        delay={0.1}
      /&gt;
      &lt;StatCard 
        title="Total Students" 
        value={stats.totalStudents} 
        icon="GraduationCap" 
        iconBgColor="bg-secondary/10" 
        iconColor="text-secondary" 
        delay={0.2}
      /&gt;
      &lt;StatCard 
        title="Active Assignments" 
        value={stats.pendingAssignments} 
        icon="FileText" 
        iconBgColor="bg-accent/10" 
        iconColor="text-accent" 
        delay={0.3}
      /&gt;
      &lt;StatCard 
        title="Recent Notifications" 
        value={stats.recentNotifications} 
        icon="Bell" 
        iconBgColor="bg-info/10" 
        iconColor="text-info" 
        delay={0.4}
      /&gt;
    &lt;/div&gt;
  );
};

export default DashboardStatsSection;