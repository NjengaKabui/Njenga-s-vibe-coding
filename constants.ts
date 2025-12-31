import { EventType, ScheduleEvent, Announcement, PortalConfig, StudentProfile, CourseMaterial, Course } from './types';

export const MOCK_PORTALS: PortalConfig[] = [
  { id: 'canvas', name: 'Canvas LMS', isConnected: true, lastSynced: new Date(), logo: 'https://picsum.photos/id/1/50/50' },
  { id: 'blackboard', name: 'Blackboard', isConnected: false, logo: 'https://picsum.photos/id/2/50/50' },
  { id: 'moodle', name: 'Moodle', isConnected: false, logo: 'https://picsum.photos/id/3/50/50' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const MOCK_SCHEDULE: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Advanced Calculus II',
    type: EventType.CLASS,
    startTime: new Date(today.setHours(9, 0, 0, 0)),
    endTime: new Date(today.setHours(10, 30, 0, 0)),
    location: 'Room 304',
    courseCode: 'MAT202'
  },
  {
    id: '2',
    title: 'Physics Lab: Optics',
    type: EventType.CLASS,
    startTime: new Date(today.setHours(11, 0, 0, 0)),
    endTime: new Date(today.setHours(13, 0, 0, 0)),
    location: 'Lab B',
    courseCode: 'PHY104'
  },
  {
    id: '3',
    title: 'Computer Networks CAT 1',
    type: EventType.CAT,
    startTime: new Date(today.setHours(14, 0, 0, 0)),
    endTime: new Date(today.setHours(15, 0, 0, 0)),
    location: 'Exam Hall A',
    courseCode: 'CSC301',
    description: 'Covers Chapters 1-4. Bring ID.'
  },
  {
    id: '4',
    title: 'Database Systems',
    type: EventType.CLASS,
    startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
    endTime: new Date(tomorrow.setHours(11, 30, 0, 0)),
    location: 'Room 201',
    courseCode: 'CSC305'
  },
  {
    id: '5',
    title: 'Final Project Submission',
    type: EventType.DEADLINE,
    startTime: new Date(tomorrow.setHours(23, 59, 0, 0)),
    endTime: new Date(tomorrow.setHours(23, 59, 0, 0)),
    courseCode: 'ENG400'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Change of Examination Venue for CSC301',
    sender: 'Registrar Office',
    date: new Date(today.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    content: `Dear Students, 
    Please be advised that the venue for the upcoming Computer Networks CAT 1 has been changed due to ongoing maintenance in the Main Hall. 
    The new venue is Exam Hall A, located in the West Wing. 
    The time remains unchanged at 14:00. 
    Please ensure you arrive at least 15 minutes early for biometric verification. 
    We apologize for any inconvenience caused.`,
    isRead: false,
    priority: 'HIGH'
  },
  {
    id: 'a2',
    title: 'Library Holiday Hours',
    sender: 'University Library',
    date: new Date(today.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    content: `This is to inform all students and staff that the main library will be operating on reduced hours during the upcoming public holiday. 
    On Friday, we will be open from 10:00 AM to 4:00 PM only. 
    Normal 24-hour operations will resume on Saturday morning. 
    Please plan your study schedules accordingly. 
    Online resources remain accessible 24/7 via the portal.`,
    isRead: true,
    priority: 'LOW'
  },
  {
    id: 'a3',
    title: 'Guest Lecture: AI in Healthcare',
    sender: 'Dept. of Computer Science',
    date: new Date(today.getTime() - 1000 * 60 * 60 * 48), // 2 days ago
    content: `We are excited to host Dr. Sarah Connor from CyberDyne Systems who will be giving a talk on the applications of AI in modern diagnostics. 
    Date: Next Wednesday. 
    Time: 4 PM. 
    Venue: Auditorium. 
    Attendance is mandatory for final year students but open to all. 
    Refreshments will be served after the Q&A session.`,
    isRead: false,
    priority: 'MEDIUM'
  }
];

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice.j@uni.edu',
    attendance: 92,
    averageGrade: 88,
    riskLevel: 'LOW',
    grades: [
      { month: 'Jan', score: 85 },
      { month: 'Feb', score: 88 },
      { month: 'Mar', score: 87 },
      { month: 'Apr', score: 91 },
      { month: 'May', score: 89 }
    ]
  },
  {
    id: 's2',
    name: 'Bob Smith',
    email: 'bob.s@uni.edu',
    attendance: 75,
    averageGrade: 62,
    riskLevel: 'HIGH',
    grades: [
      { month: 'Jan', score: 70 },
      { month: 'Feb', score: 65 },
      { month: 'Mar', score: 60 },
      { month: 'Apr', score: 55 },
      { month: 'May', score: 58 }
    ]
  },
  {
    id: 's3',
    name: 'Charlie Davis',
    email: 'charlie.d@uni.edu',
    attendance: 85,
    averageGrade: 74,
    riskLevel: 'MEDIUM',
    grades: [
      { month: 'Jan', score: 78 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 72 },
      { month: 'Apr', score: 74 },
      { month: 'May', score: 71 }
    ]
  }
];

export const MOCK_MATERIALS: CourseMaterial[] = [
  { id: 'm1', title: 'Calculus II - Chapter 4 Slides', type: 'SLIDE', courseCode: 'MAT202', uploadDate: new Date(today.getTime() - 86400000), size: '2.4 MB' },
  { id: 'm2', title: 'Physics Lab Manual v2', type: 'PDF', courseCode: 'PHY104', uploadDate: new Date(today.getTime() - 172800000), size: '1.1 MB' },
  { id: 'm3', title: 'Network Topology Video Lecture', type: 'VIDEO', courseCode: 'CSC301', uploadDate: new Date(today.getTime() - 259200000), size: '450 MB' },
  { id: 'm4', title: 'Project Guidelines', type: 'DOC', courseCode: 'ENG400', uploadDate: new Date(today.getTime() - 345600000), size: '500 KB' },
];

export const MOCK_COURSES: Course[] = [
  { code: 'MAT202', name: 'Advanced Calculus II', studentsCount: 45, nextClass: new Date(today.setHours(9, 0, 0, 0)) },
  { code: 'CSC301', name: 'Computer Networks', studentsCount: 60, nextClass: new Date(today.setHours(14, 0, 0, 0)) },
  { code: 'PHY104', name: 'Physics Lab: Optics', studentsCount: 30, nextClass: new Date(today.setHours(11, 0, 0, 0)) },
];