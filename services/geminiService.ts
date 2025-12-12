import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeAnnouncement = async (text: string): Promise<string> => {
  if (!apiKey) {
    return "API Key missing. Cannot generate summary.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarise the following school announcement into a single, concise sentence for a student dashboard. Focus on actionable details like time, venue, or deadline changes.\n\nAnnouncement:\n${text}`,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate summary. Please try again later.";
  }
};

export const generateStudyTip = async (scheduleItems: string[]): Promise<string> => {
    if (!apiKey) return "Stay organized and keep studying!";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Here are the student's upcoming events: ${scheduleItems.join(', ')}. Give a one-sentence motivational study tip or time management advice specific to this schedule.`,
        });
        return response.text || "Keep pushing forward!";
    } catch (error) {
        return "Focus on your next major deadline.";
    }
}