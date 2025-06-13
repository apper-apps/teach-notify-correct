import Home from '../pages/Home';
import Classes from '../pages/Classes';
import Assignments from '../pages/Assignments';
import Notifications from '../pages/Notifications';
import Students from '../pages/Students';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Home
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'Users',
    component: Classes
  },
  assignments: {
    id: 'assignments',
    label: 'Assignments',
    path: '/assignments',
    icon: 'FileText',
    component: Assignments
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: Notifications
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'GraduationCap',
    component: Students
  }
};

export const routeArray = Object.values(routes);