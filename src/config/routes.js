import HomePage from '@/components/pages/HomePage';
import ClassesPage from '@/components/pages/ClassesPage';
import AssignmentsPage from '@/components/pages/AssignmentsPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import StudentsPage from '@/components/pages/StudentsPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
icon: 'Home',
    component: HomePage
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'Users',
    component: ClassesPage
  },
  assignments: {
    id: 'assignments',
    label: 'Assignments',
    path: '/assignments',
    icon: 'FileText',
    component: AssignmentsPage
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: NotificationsPage
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'GraduationCap',
    component: StudentsPage
  }
};
  }
};

export const routeArray = Object.values(routes);