// Enhanced ProfileService with LinkedIn URL support

import { PARTNERSHIP_EMAIL_PROMPT, PRODUCT_EMAIL_PROMPT } from '../prompts/emailPrompt';
import { PARTNERSHIP_LINKEDIN_PROMPT, PRODUCT_LINKEDIN_PROMPT } from '../prompts/linkedinPrompt';
import { ProfileData, MessageType, MessagePurpose, ContentItem, PartnershipBenefit } from '../types';
import { GeminiService } from './geminiService';

// Extract username from LinkedIn URL
export const extractUsernameFromLinkedInUrl = (url: string): string | null => {
  try {
    // Remove trailing slashes and query parameters
    const cleanUrl = url.replace(/\/$/, '').split('?')[0];
    
    // Match LinkedIn profile URL patterns
    const patterns = [
      /linkedin\.com\/in\/([^\/\s]+)/i,
      /linkedin\.com\/pub\/([^\/\s]+)/i,
      /linkedin\.com\/profile\/view\?id=([^&\s]+)/i
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting username from LinkedIn URL:', error);
    return null;
  }
};

// Validate LinkedIn URL
export const validateLinkedInUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const normalizedUrl = url.toLowerCase().trim();
    
    // Check if it's a valid LinkedIn profile URL
    const validPatterns = [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/\s]+/,
      /^https?:\/\/(www\.)?linkedin\.com\/pub\/[^\/\s]+/,
      /^linkedin\.com\/in\/[^\/\s]+/,
      /^www\.linkedin\.com\/in\/[^\/\s]+/
    ];

    return validPatterns.some(pattern => pattern.test(normalizedUrl));
  } catch (error) {
    return false;
  }
};

// Normalize LinkedIn URL
export const normalizeLinkedInUrl = (url: string): string => {
  if (!url) return '';
  
  let normalizedUrl = url.trim();
  
  // Add https:// if not present
  if (!normalizedUrl.startsWith('http')) {
    if (normalizedUrl.startsWith('linkedin.com') || normalizedUrl.startsWith('www.linkedin.com')) {
      normalizedUrl = 'https://' + normalizedUrl;
    } else {
      normalizedUrl = 'https://linkedin.com/in/' + normalizedUrl;
    }
  }
  
  // Ensure it's a linkedin.com URL
  if (!normalizedUrl.includes('linkedin.com')) {
    return '';
  }
  
  return normalizedUrl;
};

// Enhanced profile analysis with LinkedIn URL support
export const analyzeLinkedInProfile = async (linkedinUrl: string, apiKey?: string): Promise<ProfileData> => {
  const normalizedUrl = normalizeLinkedInUrl(linkedinUrl);
  const username = extractUsernameFromLinkedInUrl(normalizedUrl);
  
  if (!username) {
    throw new Error('Invalid LinkedIn URL. Please provide a valid LinkedIn profile URL.');
  }

  if (apiKey) {
    try {
      const analysis = await GeminiService.analyzeLinkedInProfile(apiKey, normalizedUrl);
      
      return {
        name: formatNameFromUsername(username),
        username,
        linkedinUrl: normalizedUrl,
        title: analysis.extractedInfo.title,
        company: analysis.extractedInfo.company,
        bio: analysis.extractedInfo.bio,
        location: analysis.extractedInfo.location,
        experience: analysis.extractedInfo.experience,
        skills: analysis.extractedInfo.skills,
        contentItems: analysis.contentItems,
        partnershipBenefits: analysis.partnershipBenefits
      };
    } catch (error) {
      console.warn('Gemini API failed, falling back to mock data:', error);
      // Fall back to mock data if API fails
    }
  }

  // Enhanced mock data with more realistic profiles
  return generateEnhancedMockProfile(username, normalizedUrl);
};

// Generate realistic mock profiles
const generateEnhancedMockProfile = (username: string, linkedinUrl: string): ProfileData => {
  const name = formatNameFromUsername(username);
  
  const mockProfiles = [
    {
      title: 'Senior Blockchain Developer',
      company: 'ConsenSys',
      bio: 'Passionate about building decentralized applications with 5+ years in blockchain development. Expertise in Solidity, Web3.js, and DeFi protocols.',
      location: 'San Francisco, CA',
      experience: '5+ years',
      skills: ['Solidity', 'Web3.js', 'React', 'Node.js', 'DeFi'],
      contentItems: [
        { type: 'post' as const, content: 'Just wrapped up a fascinating project implementing cross-chain bridges. The future of interoperability looks bright! 🌉' },
        { type: 'article' as const, content: 'Shared insights on "Gas Optimization Techniques in Solidity" - reducing costs by up to 40%' },
        { type: 'project' as const, content: 'Lead developer on a DeFi yield farming protocol that reached $50M TVL' },
        { type: 'achievement' as const, content: 'Won first place at ETHGlobal hackathon with a novel AMM design' },
        { type: 'interest' as const, content: 'Actively researching Layer 2 scaling solutions and zero-knowledge proofs' }
      ] as ContentItem[],
      partnershipBenefits: [
        {
          forThem: 'Access to cutting-edge hackathon projects and early-stage blockchain talent for recruitment',
          forFluxor: 'Technical expertise in DeFi and smart contract development to enhance platform capabilities'
        },
        {
          forThem: 'Platform to showcase ConsenSys tools and infrastructure to developers',
          forFluxor: 'Integration with ConsenSys ecosystem and potential enterprise partnerships'
        },
        {
          forThem: 'Opportunity to mentor next-generation blockchain developers',
          forFluxor: 'Access to ConsenSys network and credibility in the blockchain space'
        }
      ] as PartnershipBenefit[]
    },
    {
      title: 'VP of Product',
      company: 'Chainlink Labs',
      bio: 'Product leader driving Web3 adoption through developer-first solutions. 8+ years in product management, specializing in blockchain infrastructure and oracle networks.',
      location: 'New York, NY',
      experience: '8+ years',
      skills: ['Product Strategy', 'Web3', 'API Design', 'Developer Relations', 'Tokenomics'],
      contentItems: [
        { type: 'post' as const, content: 'Excited about the growth in Web3 developer tools! The ecosystem is becoming more accessible every day 🚀' },
        { type: 'article' as const, content: 'Published "The Future of Oracle Networks" discussing hybrid smart contracts and real-world data integration' },
        { type: 'project' as const, content: 'Led product strategy for Chainlink VRF, now securing over $1B in on-chain value' },
        { type: 'achievement' as const, content: 'Launched Chainlink developer grants program, funding 100+ projects' },
        { type: 'interest' as const, content: 'Passionate about improving developer experience in Web3 and cross-chain interoperability' }
      ] as ContentItem[],
      partnershipBenefits: [
        {
          forThem: 'Platform to discover and support promising blockchain projects through hackathons',
          forFluxor: 'Integration with Chainlink oracles for real-time hackathon data and transparent judging'
        },
        {
          forThem: 'Access to innovative developers building the next generation of dApps',
          forFluxor: 'Chainlink partnership credibility and potential oracle integration features'
        },
        {
          forThem: 'Opportunity to guide product development for hackathon management tools',
          forFluxor: 'Product strategy expertise and insights into developer needs'
        }
      ] as PartnershipBenefit[]
    },
    // ... (other mock profiles remain the same)
  ];

  const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
  
  return {
    name,
    username,
    linkedinUrl,
    ...randomProfile
  };
};

// Enhanced message generation with proper prompt integration
export const generateMessage = async (
  profile: ProfileData, 
  messageType: MessageType, 
  purpose: MessagePurpose,
  apiKey?: string
): Promise<string> => {
  if (apiKey) {
    try {
      // Select the appropriate prompt
      let prompt: string;
      if (messageType === 'email') {
        prompt = purpose === 'partnership' ? PARTNERSHIP_EMAIL_PROMPT : PRODUCT_EMAIL_PROMPT;
      } else {
        prompt = purpose === 'partnership' ? PARTNERSHIP_LINKEDIN_PROMPT : PRODUCT_LINKEDIN_PROMPT;
      }

      // Replace variables in the prompt
      const populatedPrompt = replacePromptVariables(prompt, profile);
      
      // Generate message using Gemini API
      return await GeminiService.callGeminiAPI(apiKey, populatedPrompt);
    } catch (error) {
      console.warn('Gemini API failed for message generation, falling back to mock:', error);
      // Fall back to mock message if API fails
    }
  }

  // Enhanced mock messages as fallback
  return generateEnhancedMockMessage(profile, messageType, purpose);
};

// Replace prompt variables with actual data
const replacePromptVariables = (prompt: string, profile: ProfileData): string => {
  const contentItemsText = profile.contentItems?.map(item => 
    `- ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.content}`
  ).join('\n') || 'No specific content items available.';

  const partnershipBenefitsText = profile.partnershipBenefits?.map(benefit => 
    `- For them: ${benefit.forThem}\n  For Fluxor: ${benefit.forFluxor}`
  ).join('\n') || 'Mutual benefits to be discussed.';

  const skillsText = profile.skills?.join(', ') || 'Not specified';

  return prompt
    .replace(/{{name}}/g, profile.name)
    .replace(/{{title}}/g, profile.title || 'Professional')
    .replace(/{{company}}/g, profile.company || 'their organization')
    .replace(/{{linkedinUrl}}/g, profile.linkedinUrl)
    .replace(/{{bio}}/g, profile.bio || 'Blockchain and technology professional')
    .replace(/{{location}}/g, profile.location || 'Not specified')
    .replace(/{{experience}}/g, profile.experience || 'Several years')
    .replace(/{{skills}}/g, skillsText)
    .replace(/{{contentItems}}/g, contentItemsText)
    .replace(/{{partnershipBenefits}}/g, partnershipBenefitsText);
};

// Generate enhanced mock messages
const generateEnhancedMockMessage = (
  profile: ProfileData, 
  messageType: MessageType, 
  purpose: MessagePurpose
): string => {
  const isEmail = messageType === 'email';
  
  if (purpose === 'partnership') {
    if (isEmail) {
      return `Subject: Strategic Partnership Opportunity - ${profile.company} x Fluxor

Hi ${profile.name},

I hope this email finds you well. I came across your profile and was genuinely impressed by your work as ${profile.title} at ${profile.company}.

Your expertise in ${profile.skills?.[0]} and ${profile.skills?.[1]} aligns perfectly with Fluxor's mission to revolutionize hackathon management through on-chain governance. Given ${profile.company}'s leadership in the blockchain space, I believe there's tremendous potential for a strategic partnership.

I'd love to explore how we could collaborate - whether through co-hosting hackathons on our platform, integrating ${profile.company}'s technology, or developing joint initiatives that benefit both our communities. Our transparent, on-chain approach to hackathon management could provide valuable insights for ${profile.company}'s developer ecosystem.

Would you be available for a brief call next week to discuss partnership opportunities? I'm confident we could create something impactful together.

Best regards,
Alex Rivera
Partnership Director, Fluxor
alex@fluxor.io
📧 alex@fluxor.io | 🔗 fluxor.io`;
    } else {
      return `Hi ${profile.name}! 👋

Saw your impressive work at ${profile.company} - particularly your focus on ${profile.skills?.[0]}. Really resonated with our mission at Fluxor.

We're building the future of hackathon management with on-chain governance, and I think ${profile.company} + Fluxor could create something amazing together. 

Your recent post about blockchain innovation really caught my attention. Would love to explore partnership opportunities - maybe a quick 15-min call?

Best,
Alex from Fluxor 🚀`;
    }
  } else {
    if (isEmail) {
      return `Subject: Transform Your Innovation Programs with On-Chain Hackathons

Hi ${profile.name},

Hope you're doing well! I noticed your role as ${profile.title} at ${profile.company} and thought you'd be interested in how Fluxor is revolutionizing hackathon management.

Given your expertise in ${profile.skills?.[0]} and ${profile.company}'s focus on innovation, I imagine you're always looking for better ways to discover and nurture top talent. That's exactly where Fluxor excels.

Our platform offers:
• Transparent on-chain governance for fair judging
• Streamlined hackathon management and participant tracking  
• Access to a curated network of blockchain developers
• Real-time analytics and automated prize distribution

Companies like ${profile.company} are seeing 40% improvements in their hackathon ROI and participant satisfaction with our platform.

Would you be interested in a quick demo? I'd love to show you how we can elevate ${profile.company}'s innovation programs.

Best regards,
Jordan Martinez
Solutions Consultant, Fluxor
jordan@fluxor.io

P.S. We're offering early access to our new cross-chain hackathon features - perfect for companies pushing the boundaries like ${profile.company}!`;
    } else {
      return `Hi ${profile.name}! 

Quick question - how are you currently managing innovation programs at ${profile.company}?

Just launched Fluxor, an on-chain hackathon platform that's helping companies like yours discover top blockchain talent 40% faster with transparent governance. ⚡

Worth a quick demo? Takes 10 minutes and think you'd find it valuable given your expertise in ${profile.skills?.[0]}.

Check it out: fluxor.io

Cheers,
Jordan from Fluxor 🔗`;
    }
  }
};

// Helper function to format username into proper name
const formatNameFromUsername = (username: string): string => {
  return username
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};