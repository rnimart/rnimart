
import { GoogleGenAI, Type } from "@google/genai";
import { AdminStats } from "../types";

export const getBusinessInsights = async (stats: AdminStats) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this business data for RNI Mart:
    - Total Revenue: Rp ${stats.totalOmzet.toLocaleString('id-ID')}
    - Total Orders: ${stats.totalOrders}
    - Top Products: ${stats.topProducts.map(p => `${p.nama} (${p.qty} sold)`).join(', ')}
    - Top Customers: ${stats.topCustomers.map(c => `${c.nama} (Spent: Rp ${c.total.toLocaleString('id-ID')})`).join(', ')}
    - Pending Orders: ${stats.pendingCount}
    - Completed Orders: ${stats.selesaiCount}

    Provide a concise (max 3 sentences) expert business insight and one actionable recommendation for the owner.
    Format the response as a friendly advice from an Enterprise consultant.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate business insights at this time. Please check your analytics manually.";
  }
};
