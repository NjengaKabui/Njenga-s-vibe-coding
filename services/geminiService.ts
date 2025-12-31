import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeAnnouncement = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarise the following school announcement into a single, concise sentence for a student dashboard. Focus on actionable details like time, venue, or deadline changes.\n\nAnnouncement:\n${text}`,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary.";
  }
};

export const generateStudyTip = async (scheduleItems: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Here are the student's upcoming events: ${scheduleItems.join(', ')}. Give a one-sentence motivational study tip or time management advice specific to this schedule.`,
    });
    return response.text || "Keep pushing forward!";
  } catch (error) {
    return "Focus on your next major deadline.";
  }
};

export const analyzeStudentPerformance = async (student: StudentProfile): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following student data and provide a 2-sentence summary for the teacher regarding their risk level and recommended action. 
      Student: ${student.name}, Grade Avg: ${student.averageGrade}, Attendance: ${student.attendance}%, Risk: ${student.riskLevel}, Trend: ${student.grades.map(g => g.score).join(', ')}.`,
    });
    return response.text || "Review student's recent assignments.";
  } catch (error) {
    return "Unable to generate analysis.";
  }
};

export const suggestLessonAdjustments = async (courseCode: string, feedbacks: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an academic advisor. Based on these student feedbacks for course ${courseCode}, suggest 3 brief adjustments to the teaching plan.
      Feedbacks:
      ${feedbacks.map(f => `- ${f}`).join('\n')}`,
    });
    return response.text || "Continue with current teaching plan.";
  } catch (error) {
    return "Collect more feedback to generate insights.";
  }
};