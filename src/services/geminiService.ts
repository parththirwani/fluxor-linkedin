import { PARTNERSHIP_EMAIL_PROMPT, PRODUCT_EMAIL_PROMPT } from '../prompts/emailPrompt';
import { OutreachData, ProfileAnalysis, Person } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  private async callGeminiAPI(apiKey: string, prompt: string): Promise<string> {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate content');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  private replacePromptVariables(
    prompt: string, 
    person: Person, 
    extractedInfo: any, 
    contentItems: any[], 
    partnershipBenefits?: any[]
  ): string {
    const contentItemsText = contentItems
      .map(item => `- ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.content}`)
      .join('\n');

    const benefitsText = partnershipBenefits 
      ? partnershipBenefits.map(benefit => `- Benefit for them: ${benefit.forThem}\n  Benefit for Fluxor: ${benefit.forFluxor}`).join('\n')
      : '';

    return prompt
      .replace('{{name}}', person.name)
      .replace('{{title}}', extractedInfo.title || 'Professional')
      .replace('{{company}}', extractedInfo.company || 'their organization')
      .replace('{{linkedinUrl}}', person.linkedinUrl)
      .replace('{{bio}}', extractedInfo.bio || 'Blockchain and technology professional')
      .replace('{{contentItems}}', contentItemsText)
      .replace('{{partnershipBenefits}}', benefitsText);
  }

  async analyzeLinkedInProfile(apiKey: string, person: Person): Promise<ProfileAnalysis> {
    const prompt = `
    You are analyzing a LinkedIn profile for outreach purposes. Based on the person's name "${person.name}" and their LinkedIn URL "${person.linkedinUrl}", I need you to:

    1. Extract their professional information (title, company, bio)
    2. Identify their key content and activities 
    3. Suggest partnership benefits

    Please provide a detailed analysis in the following JSON format:

    {
      "extractedInfo": {
        "title": "Their job title",
        "company": "Their company name", 
        "bio": "A brief professional bio based on their profile"
      },
      "contentItems": [
        {
          "type": "post|article|project|achievement|interest",
          "content": "Description of their content or activity"
        }
      ],
      "partnershipBenefits": [
        {
          "forThem": "What they would gain from partnering with Fluxor",
          "forFluxor": "What Fluxor would gain from this partnership"
        }
      ]
    }

    Focus on:
    - Their recent posts and professional activities
    - Their expertise areas and interests
    - Projects they've worked on or companies they've been involved with
    - How their background could create mutual value with Fluxor (an on-chain hackathon management platform)
    
    Provide at least 4-5 content items and 3-4 partnership benefits.
    Make the analysis realistic and detailed based on what you would typically find on a blockchain/tech professional's LinkedIn profile.
    `;

    try {
      const response = await this.callGeminiAPI(apiKey, prompt);
      
      // Parse the JSON response
      const analysisData = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());
      
      return analysisData as ProfileAnalysis;
    } catch (error) {
      console.error('Error parsing profile analysis:', error);
      // Fallback with mock data if parsing fails
      return {
        extractedInfo: {
          title: "Blockchain Developer",
          company: "Tech Innovations Inc.",
          bio: "Experienced blockchain developer with expertise in DeFi and smart contracts."
        },
        contentItems: [
          { type: 'post', content: 'Recently shared insights on cross-chain interoperability challenges.' },
          { type: 'project', content: 'Led development of a multi-chain DEX aggregator.' },
          { type: 'interest', content: 'Actively engaged in discussions about DAO governance models.' },
          { type: 'achievement', content: 'Recognized as top contributor in recent hackathon.' },
          { type: 'article', content: 'Published technical article on zero-knowledge proofs in DeFi.' }
        ],
        partnershipBenefits: [
          {
            forThem: "Early access to cutting-edge blockchain talent and innovative solutions from Fluxor hackathons.",
            forFluxor: "Leverage their technical expertise to enhance our platform's DeFi integrations."
          },
          {
            forThem: "Platform to showcase their technology through sponsored challenges and workshops.",
            forFluxor: "Gain credibility and expand our network in the DeFi development community."
          },
          {
            forThem: "Opportunity to mentor next-generation blockchain developers.",
            forFluxor: "Access to their extensive professional network and industry connections."
          }
        ]
      };
    }
  }

  async generatePersonalizedOutreach(apiKey: string, outreachData: OutreachData): Promise<string> {
    if (!outreachData.profileAnalysis) {
      throw new Error('Profile analysis required for email generation');
    }

    const { person, profileAnalysis, outreachOptions } = outreachData;
    const { extractedInfo, contentItems, partnershipBenefits } = profileAnalysis;

    // Select the appropriate prompt based on message type and purpose
    let selectedPrompt: string;
    
    if (outreachOptions.messageType === 'email') {
      selectedPrompt = outreachOptions.purpose === 'partnership' 
        ? PARTNERSHIP_EMAIL_PROMPT 
        : PRODUCT_EMAIL_PROMPT;
    } else {
      selectedPrompt = outreachOptions.purpose === 'partnership' 
        ? PARTNERSHIP_EMAIL_PROMPT 
        : PRODUCT_EMAIL_PROMPT;
    }

    // Replace variables in the prompt
    const populatedPrompt = this.replacePromptVariables(
      selectedPrompt, 
      person, 
      extractedInfo, 
      contentItems, 
      outreachOptions.purpose === 'partnership' ? partnershipBenefits : undefined
    );

    return this.callGeminiAPI(apiKey, populatedPrompt);
  }
}

export const geminiService = new GeminiService();