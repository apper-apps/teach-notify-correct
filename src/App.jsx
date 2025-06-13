import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from './components/pages/HomePage';
import ClassesPage from './components/pages/ClassesPage';
import AssignmentsPage from './components/pages/AssignmentsPage';
import NotificationsPage from './components/pages/NotificationsPage';
import StudentsPage from './components/pages/StudentsPage';
import NotFoundPage from './components/pages/NotFoundPage';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;