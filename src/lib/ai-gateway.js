/**
 * 🤖 Advanced AI Gateway for FarmConnect
 * Handles multi-model fallbacks and multi-key rotation for AI responses.
 */
import { smartFetch } from './api-config';

export const getAIResponse = async (query, userContext = {}) => {
    console.log("AI Gateway: Querying Secure Backend Proxy...");

    try {
        // Use smartFetch which now routes to localhost:3001/api/ai/generate
        const responseData = await smartFetch('ai', { prompt: query });

        if (responseData && responseData.candidates && responseData.candidates[0].content) {
            const aiText = responseData.candidates[0].content.parts[0].text;
            return {
                provider: 'Gemini 1.5 Flash (Secure)',
                text: aiText
            };
        }

        console.warn("AI Gateway: Unexpected response structure", responseData);
        return null;
    } catch (e) {
        console.error("AI Gateway Error:", e);
        return null;
    }
};
