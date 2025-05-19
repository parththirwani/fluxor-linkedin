// services/geminiService.ts
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  static async callGeminiAPI(apiKey: string, prompt: string): Promise<string> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gemini API request failed');
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  static async analyzeLinkedInProfile(apiKey: string, username: string): Promise<any> {
    const analysisPrompt = `
You are analyzing a LinkedIn profile for outreach purposes. Based on the username "${username}", generate realistic professional information that would typically be found on a LinkedIn profile.

Provide a detailed analysis in the following JSON format:

{
  "extractedInfo": {
    "title": "A realistic job title based on the username/name",
    "company": "A believable company name",
    "bio": "A professional bio highlighting expertise and experience (2-3 sentences)",
    "location": "A professional location",
    "experience": "Years of experience in the field",
    "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
  },
  "contentItems": [
    {
      "type": "post",
      "content": "A realistic recent LinkedIn post about their work or industry"
    },
    {
      "type": "article",
      "content": "A professional article they might have shared or written"
    },
    {
      "type": "project",
      "content": "A project they've worked on related to their field"
    },
    {
      "type": "achievement",
      "content": "A professional achievement or milestone"
    },
    {
      "type": "interest",
      "content": "Professional interests and areas of focus"
    }
  ],
  "partnershipBenefits": [
    {
      "forThem": "Specific benefit they would gain from partnering with Fluxor",
      "forFluxor": "Specific benefit Fluxor would gain from this partnership"
    },
    {
      "forThem": "Another benefit for them",
      "forFluxor": "Another benefit for Fluxor"
    },
    {
      "forThem": "Third benefit for them",
      "forFluxor": "Third benefit for Fluxor"
    }
  ]
}

Make the analysis realistic and detailed based on what you would expect for someone in the blockchain/tech industry. Consider the following professional roles: blockchain developer, product manager, CTO, founder, marketing director, business development, venture capitalist, etc.

Focus on creating content that would make sense for partnership or product introduction outreach for Fluxor (an on-chain hackathon management platform).

Only return the JSON object, no additional text.
`;

    try {
      const response = await this.callGeminiAPI(apiKey, analysisPrompt);
      return JSON.parse(response.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.error('Error analyzing LinkedIn profile:', error);
      throw new Error('Failed to analyze LinkedIn profile');
    }
  }
}