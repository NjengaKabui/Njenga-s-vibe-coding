export enum EventType {
  CLASS = 'CLASS',
  EXAM = 'EXAM',
  CAT = 'CAT', // Continuous Assessment Test
  DEADLINE = 'DEADLINE',
  STUDY_BLOCK = 'STUDY_BLOCK'
}

export type UserRole = 'STUDENT' | 'TEACHER';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: EventType;
  startTime: Date;
  endTime: Date;
  location?: string;
  courseCode?: string;
  description?: string;
}

export interface Announcement {
  id: string;
  title: string;
  sender: string;
  date: Date;
  content: string;
  summary?: string; // AI Generated
  isRead: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PortalConfig {
  id: string;
  name: string;
  isConnected: boolean;
  lastSynced?: Date;
  logo: string;
}

export interface UserStats {
  studyHours: number;
  classesAttended: number;
  assignmentsPending: number;
  examreadiness: number; // 0-100
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'SLIDE' | 'VIDEO' | 'DOC';
  courseCode: string;
  uploadDate: Date;
  size: string;
  url?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  attendance: number;
  averageGrade: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  grades: { month: string; score: number }[];
}

export interface Course {
  code: string;
  name: string;
  studentsCount: number;
  nextClass: Date;
}