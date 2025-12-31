import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import Announcements from './components/Announcements';
import Settings from './components/Settings';
import Courses from './components/Courses';
import Performance from './components/Performance';
import { UserRole, Announcement, CourseMaterial, StudentProfile } from './types';
import { MOCK_ANNOUNCEMENTS, MOCK_MATERIALS, MOCK_STUDENTS } from './constants';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [materials, setMaterials] = useState<CourseMaterial[]>(MOCK_MATERIALS);
  const [students, setStudents] = useState<StudentProfile[]>(MOCK_STUDENTS);

  const toggleRole = () => {
    setUserRole(prev => prev === 'STUDENT' ? 'TEACHER' : 'STUDENT');
  };

  const addAnnouncement = (a: Announcement) => setAnnouncements(prev => [a, ...prev]);
  const addMaterial = (m: CourseMaterial) => setMaterials(prev => [m, ...prev]);
  const updateStudent = (updated: StudentProfile) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  return (
    <Router>
      <Layout userRole={userRole} onSwitchRole={toggleRole}>
        <Routes>
          <Route element={
            <Outlet context={{ 
              userRole, 
              announcements, setAnnouncements: addAnnouncement,
              materials, setMaterials: addMaterial,
              students, updateStudent
            }} />
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedule" element={<ScheduleView />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/students" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;