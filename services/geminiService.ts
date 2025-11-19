
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. The app may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY' });

export const generateNotesForSubject = async (branch: string, semester: string, subject: string): Promise<string> => {
  const prompt = `
    Generate comprehensive, well-structured, and easy-to-understand study notes for the subject "${subject}" which is part of the "${semester}" of the "${branch}" diploma curriculum under MSBTE (Maharashtra State Board of Technical Education).

    The notes should be in Markdown format.

    Please ensure the following:
    1.  **Cover Key Topics**: Include all major chapters and important concepts as per the MSBTE syllabus.
    2.  **Structured Format**: Use headings (#), subheadings (##, ###), bold text, and italics to organize the content clearly.
    3.  **Use Lists**: Employ bullet points or numbered lists for definitions, advantages, disadvantages, and key points to enhance readability.
    4.  **Clarity and Simplicity**: Explain complex topics in a simple and concise manner.
    5.  **Code Snippets (if applicable)**: For programming subjects, include well-commented code examples to illustrate concepts.
    6.  **Diagrams/Flowcharts**: Where appropriate, describe where a diagram or flowchart would be useful and what it would illustrate.
    7.  **Completeness**: The notes should be thorough enough for exam preparation.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    // The .text property will throw an error if the response was blocked.
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    // Re-throw the original error to preserve its structure and message for detailed handling in the UI.
    throw error;
  }
};
