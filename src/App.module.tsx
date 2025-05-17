// import {
//   AlertCircle,
//   Building,
//   CheckCircle,
//   Copy,
//   Globe,
//   Linkedin,
//   Loader,
//   Mail,
//   Search,
//   Sparkles,
//   User
// } from 'lucide-react';
// import { useState } from 'react';

// // Gemini API configuration
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// // Types
// interface Company {
//   name: string;
//   website: string;
//   linkedin: string;
//   description?: string;
//   recentPosts?: string[];
// }

// interface EmailData {
//   company: Company;
//   recipientName: string;
//   recipientTitle: string;
//   recipientEmail: string;
//   emailContent?: string;
//   status: 'idle' | 'loading' | 'success' | 'error';
//   error?: string;
// }

// // Helper functions
// const fetchCompanyInfo = async (companyLinkedIn: string) => {
//   // In a real implementation, this would use LinkedIn's API or a scraping service
//   // For demo purposes, we'll simulate the data
//   console.log(`Fetching company info for: ${companyLinkedIn}`);
  
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   // Extract company name from LinkedIn URL
//   const companyName = companyLinkedIn.split('/company/')[1]?.split('/')[0] || '';
  
//   // Demo data based on URL
//   return {
//     name: companyName.charAt(0).toUpperCase() + companyName.slice(1).replace(/-/g, ' '),
//     website: `https://${companyName}.com`,
//     linkedin: companyLinkedIn,
//     description: `${companyName.charAt(0).toUpperCase() + companyName.slice(1).replace(/-/g, ' ')} is a leading company in blockchain technology and innovation.`,
//     recentPosts: [
//       "We're excited to announce our new partnership with a major DeFi protocol.",
//       "Our team is growing! We're looking for talented developers to join us.",
//       "Check out our latest blog post on the future of web3 technologies."
//     ]
//   };
// };

// const fetchWebsiteContent = async (websiteUrl: string) => {
//   // In a real implementation, this would use a web scraping service
//   console.log(`Fetching website content for: ${websiteUrl}`);
  
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   // Demo data
//   return `${websiteUrl} specializes in blockchain solutions with a focus on DeFi and web3 infrastructure. Their team has experience in smart contract development, tokenomics, and blockchain integration.`;
// };

// const generateEmailWithGemini = async (apiKey: string, emailData: EmailData): Promise<string> => {
//   try {
//     // Create a detailed prompt for Gemini API
//     const prompt = `
//     You are writing a personalized investment outreach email for a startup called Fluxor (https://fluxor.io).
//     Fluxor is an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons.
    
//     Please write a compelling, personalized email to the following potential investor:
    
//     Recipient Name: ${emailData.recipientName}
//     Recipient Title: ${emailData.recipientTitle}
//     Company: ${emailData.company.name}
    
//     Company Information:
//     - Description: ${emailData.company.description}
//     - Recent LinkedIn Posts: ${emailData.company.recentPosts?.join(' | ')}
//     - Website Content Summary: ${await fetchWebsiteContent(emailData.company.website)}
    
//     The email should:
//     1. Be personalized based on the company's focus and recent activities
//     2. Briefly introduce Fluxor as an on-chain hackathon management platform
//     3. Explain why this specific company would benefit from investing in Fluxor
//     4. Include specific references to the company's recent posts or activities
//     5. Request a meeting or call to discuss further
//     6. Keep the email concise (max 250-300 words)
//     7. Use a professional but conversational tone
//     8. Include a compelling subject line
    
//     Format your response as a complete email including the subject line, greeting, body, and signature.
//     `;
    
//     const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         contents: [{
//           parts: [{
//             text: prompt
//           }]
//         }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 1024,
//         }
//       })
//     });
    
//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.error?.message || 'Failed to generate email content');
//     }
    
//     return data.candidates[0].content.parts[0].text;
    
//   } catch (error) {
//     console.error('Error generating email with Gemini:', error);
//     throw error;
//   }
// };

// // Main component
// const FluxorEmailAgent = () => {
//   const [apiKey, setApiKey] = useState('');
//   const [emailData, setEmailData] = useState<EmailData>({
//     company: {
//       name: '',
//       website: '',
//       linkedin: '',
//     },
//     recipientName: '',
//     recipientTitle: '',
//     recipientEmail: '',
//     status: 'idle'
//   });
//   const [linkedinUrl, setLinkedinUrl] = useState('');
//   const [copied, setCopied] = useState(false);
//   const [isConfigOpen, setIsConfigOpen] = useState(true);

//   const handleFetchCompanyInfo = async () => {
//     if (!linkedinUrl.includes('linkedin.com/company')) {
//       alert('Please enter a valid LinkedIn company URL');
//       return;
//     }
    
//     try {
//       const companyInfo = await fetchCompanyInfo(linkedinUrl);
//       setEmailData(prev => ({
//         ...prev,
//         company: companyInfo
//       }));
//     } catch (error) {
//       console.error('Error fetching company info:', error);
//       alert('Failed to fetch company information');
//     }
//   };

//   const handleGenerateEmail = async () => {
//     if (!apiKey) {
//       alert('Please enter your Gemini API key');
//       return;
//     }
    
//     if (!emailData.company.name || !emailData.recipientName || !emailData.recipientEmail) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     setEmailData(prev => ({
//       ...prev,
//       status: 'loading',
//       emailContent: undefined,
//       error: undefined
//     }));
    
//     try {
//       const emailContent = await generateEmailWithGemini(apiKey, emailData);
      
//       setEmailData(prev => ({
//         ...prev,
//         emailContent,
//         status: 'success'
//       }));
//     } catch (error) {
//       setEmailData(prev => ({
//         ...prev,
//         status: 'error',
//         error: error instanceof Error ? error.message : 'Unknown error occurred'
//       }));
//     }
//   };

//   const copyToClipboard = () => {
//     if (emailData.emailContent) {
//       navigator.clipboard.writeText(emailData.emailContent);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         <header className="mb-8 text-center">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <Sparkles className="w-6 h-6 text-blue-600" />
//             <h1 className="text-3xl font-bold text-gray-900">Fluxor Investor Outreach</h1>
//           </div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Generate personalized investment outreach emails for your on-chain hackathon management platform
//           </p>
//         </header>

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Configuration Panel */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <User className="w-5 h-5 text-blue-500" />
//                 Configuration
//               </h2>
//               <button 
//                 onClick={() => setIsConfigOpen(!isConfigOpen)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 {isConfigOpen ? 'Hide' : 'Show'}
//               </button>
//             </div>

//             {isConfigOpen && (
//               <>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Gemini API Key
//                   </label>
//                   <input
//                     type="password"
//                     value={apiKey}
//                     onChange={(e) => setApiKey(e.target.value)}
//                     placeholder="Enter your Gemini API key"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     Your API key is used only for generating emails and isn't stored.
//                   </p>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Company LinkedIn URL
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={linkedinUrl}
//                       onChange={(e) => setLinkedinUrl(e.target.value)}
//                       placeholder="https://linkedin.com/company/example"
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={handleFetchCompanyInfo}
//                       disabled={!linkedinUrl.includes('linkedin.com/company')}
//                       className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1"
//                     >
//                       <Search className="w-4 h-4" />
//                       Fetch
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Company Information
//                   </label>
//                   <div className="p-3 bg-gray-50 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                       <Building className="w-4 h-4 text-gray-500" />
//                       <span className="font-medium">{emailData.company.name || 'No company selected'}</span>
//                     </div>
//                     {emailData.company.website && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <Globe className="w-3 h-3" />
//                         <a href={emailData.company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
//                           {emailData.company.website}
//                         </a>
//                       </div>
//                     )}
//                     {emailData.company.linkedin && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
//                         <Linkedin className="w-3 h-3" />
//                         <a href={emailData.company.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
//                           LinkedIn Profile
//                         </a>
//                       </div>
//                     )}
//                     {emailData.company.description && (
//                       <p className="text-sm text-gray-600 mt-2">{emailData.company.description}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Recipient Details
//                   </label>
//                   <div className="grid grid-cols-2 gap-3 mb-3">
//                     <input
//                       type="text"
//                       value={emailData.recipientName}
//                       onChange={(e) => setEmailData(prev => ({ ...prev, recipientName: e.target.value }))}
//                       placeholder="Recipient Name"
//                       className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="text"
//                       value={emailData.recipientTitle}
//                       onChange={(e) => setEmailData(prev => ({ ...prev, recipientTitle: e.target.value }))}
//                       placeholder="Job Title (e.g. CEO)"
//                       className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <input
//                     type="email"
//                     value={emailData.recipientEmail}
//                     onChange={(e) => setEmailData(prev => ({ ...prev, recipientEmail: e.target.value }))}
//                     placeholder="Recipient Email"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <button
//                   onClick={handleGenerateEmail}
//                   disabled={!apiKey || !emailData.company.name || !emailData.recipientName || !emailData.recipientEmail || emailData.status === 'loading'}
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {emailData.status === 'loading' ? (
//                     <>
//                       <Loader className="w-5 h-5 animate-spin" />
//                       Generating Email...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-5 h-5" />
//                       Generate Personalized Email
//                     </>
//                   )}
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Email Preview Panel */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <Mail className="w-5 h-5 text-blue-500" />
//                 Email Preview
//               </h2>
//               {emailData.emailContent && (
//                 <button
//                   onClick={copyToClipboard}
//                   className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
//                 >
//                   {copied ? (
//                     <>
//                       <CheckCircle className="w-4 h-4" />
//                       Copied!
//                     </>
//                   ) : (
//                     <>
//                       <Copy className="w-4 h-4" />
//                       Copy
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
            
//             <div className="border border-gray-200 rounded-lg p-4 min-h-96 bg-gray-50 relative overflow-auto">
//               {emailData.status === 'loading' ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="flex flex-col items-center gap-2">
//                     <Loader className="w-8 h-8 text-blue-500 animate-spin" />
//                     <p className="text-gray-600">Generating your personalized email...</p>
//                   </div>
//                 </div>
//               ) : emailData.status === 'error' ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="flex flex-col items-center gap-2 text-red-500">
//                     <AlertCircle className="w-8 h-8" />
//                     <p className="text-center">Error: {emailData.error}</p>
//                   </div>
//                 </div>
//               ) : emailData.emailContent ? (
//                 <div className="whitespace-pre-line font-sans text-gray-800">
//                   {emailData.emailContent}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                   <Mail className="w-12 h-12 mb-2" />
//                   <p>Your personalized email will appear here</p>
//                   <p className="text-sm mt-1">Fill in the details and click "Generate"</p>
//                 </div>
//               )}
//             </div>
            
//             {emailData.emailContent && (
//               <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
//                 <h3 className="text-sm font-medium text-blue-800 mb-1">Next Steps</h3>
//                 <p className="text-sm text-blue-700">
//                   1. Review the email and make any personal edits
//                 </p>
//                 <p className="text-sm text-blue-700">
//                   2. Copy and send from your email client for a personal touch
//                 </p>
//                 <p className="text-sm text-blue-700">
//                   3. Follow up in 3-5 business days if you don't receive a response
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <footer className="mt-8 text-center text-sm text-gray-500">
//           <p>© 2025 Fluxor | On-chain Hackathon Management Platform</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default FluxorEmailAgent;


import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Copy,
  Github,
  Linkedin,
  Loader,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Twitter,
  User
} from 'lucide-react';
import { useState } from 'react';

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Types
interface PersonProfile {
  name: string;
  title: string;
  company: string;
  linkedin: string;
  twitter?: string;
  github?: string;
  bio?: string;
  interests?: string[];
  recentPosts?: string[];
  projects?: string[];
}

interface OutreachData {
  person: PersonProfile;
  email: string;
  outreachPurpose: 'partnership' | 'community' | 'hackathon-participant' | 'mentor' | 'speaker';
  emailContent?: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

// Helper functions
const fetchPersonInfo = async (linkedinUrl: string) => {
  // In a real implementation, this would use LinkedIn's API or a scraping service
  // For demo purposes, we'll simulate the data
  console.log(`Fetching person info for: ${linkedinUrl}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract username from LinkedIn URL
  const username = linkedinUrl.split('/in/')[1]?.split('/')[0] || '';
  const nameParts = username.split('-');
  const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || '';
  const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
  
  // Demo data based on URL
  return {
    name: `${firstName} ${lastName}`,
    title: "Blockchain Developer",
    company: "TechInnovate",
    linkedin: linkedinUrl,
    twitter: `https://twitter.com/${username}`,
    github: `https://github.com/${username}`,
    bio: `Passionate blockchain developer with expertise in Solidity, Web3, and DeFi protocols. Building the future of decentralized applications.`,
    interests: ["Blockchain", "Ethereum", "Smart Contracts", "Hackathons", "DeFi"],
    recentPosts: [
      "Just finished participating in ETHGlobal hackathon. Amazing experience!",
      "Working on a new DeFi protocol that integrates with multiple chains.",
      "Excited about the potential of zero-knowledge proofs in blockchain applications."
    ],
    projects: [
      "DeFi Yield Aggregator",
      "NFT Marketplace",
      "Cross-chain Bridge Solution"
    ]
  };
};

const generatePersonalOutreach = async (apiKey: string, outreachData: OutreachData): Promise<string> => {
  try {
    // Create a detailed prompt for Gemini API based on outreach purpose
    let purposeSpecificPrompt = '';
    
    switch (outreachData.outreachPurpose) {
      case 'partnership':
        purposeSpecificPrompt = `
          You're reaching out to explore potential partnership opportunities between Fluxor and ${outreachData.person.company}.
          Highlight how Fluxor's hackathon platform could integrate with their existing products or services.
          Suggest specific collaboration ideas based on their background.
        `;
        break;
      case 'community':
        purposeSpecificPrompt = `
          You're inviting them to join the Fluxor community as an early member.
          Emphasize the benefits of being part of the community, such as networking with other blockchain professionals.
          Mention any community features that align with their interests.
        `;
        break;
      case 'hackathon-participant':
        purposeSpecificPrompt = `
          You're inviting them to participate in an upcoming hackathon hosted on the Fluxor platform.
          Highlight the hackathon themes that align with their skills and interests.
          Mention the prizes, judges, and potential for networking.
        `;
        break;
      case 'mentor':
        purposeSpecificPrompt = `
          You're inviting them to become a mentor for hackathons on the Fluxor platform.
          Emphasize how their expertise in ${outreachData.person.interests?.join(', ')} would be valuable to hackathon participants.
          Mention the time commitment and benefits of being a mentor.
        `;
        break;
      case 'speaker':
        purposeSpecificPrompt = `
          You're inviting them to speak at an upcoming event hosted by Fluxor.
          Suggest specific topics based on their expertise that would be valuable to the Fluxor community.
          Provide details about the format, audience, and benefits of speaking.
        `;
        break;
    }
    
    const prompt = `
    You are writing a personalized outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform.
    
    The recipient is:
    
    Name: ${outreachData.person.name}
    Title: ${outreachData.person.title}
    Company: ${outreachData.person.company}
    Bio: ${outreachData.person.bio}
    Interests: ${outreachData.person.interests?.join(', ')}
    Recent LinkedIn/Twitter posts: ${outreachData.person.recentPosts?.join(' | ')}
    Projects they've worked on: ${outreachData.person.projects?.join(', ')}
    
    ${purposeSpecificPrompt}
    
    The email should:
    1. Be genuinely personalized based on their background, interests, and recent activities
    2. Be conversational and friendly, not formal or salesy
    3. Show that you've done your research on them
    4. Include 1-2 specific references to their work, posts, or projects
    5. Clearly explain why you're reaching out to them specifically
    6. Include a simple, low-pressure call to action
    7. Be concise (150-200 words maximum)
    
    Format your response as a complete email including subject line, greeting, body, and signature.
    Keep the tone authentic, personal, and conversational, as if you're reaching out to a potential collaborator.
    `;
    
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
          maxOutputTokens: 800,
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate email content');
    }
    
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Error generating email with Gemini:', error);
    throw error;
  }
};

// Purpose options for the dropdown
const outreachPurposes = [
  { value: 'partnership', label: 'Partnership Opportunity', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'community', label: 'Community Invitation', icon: <MessageSquare className="w-4 h-4" /> },
  { value: 'hackathon-participant', label: 'Hackathon Participant', icon: <Github className="w-4 h-4" /> },
  { value: 'mentor', label: 'Mentor Invitation', icon: <User className="w-4 h-4" /> },
  { value: 'speaker', label: 'Speaker Request', icon: <MessageSquare className="w-4 h-4" /> }
];

// Main component
const FluxorPersonalOutreach = () => {
  const [apiKey, setApiKey] = useState('');
  const [outreachData, setOutreachData] = useState<OutreachData>({
    person: {
      name: '',
      title: '',
      company: '',
      linkedin: '',
    },
    email: '',
    outreachPurpose: 'partnership',
    status: 'idle'
  });
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  const handleFetchPersonInfo = async () => {
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      alert('Please enter a valid LinkedIn profile URL');
      return;
    }
    
    try {
      const personInfo = await fetchPersonInfo(linkedinUrl);
      setOutreachData(prev => ({
        ...prev,
        person: personInfo
      }));
    } catch (error) {
      console.error('Error fetching person info:', error);
      alert('Failed to fetch profile information');
    }
  };

  const handleGenerateEmail = async () => {
    if (!apiKey) {
      alert('Please enter your Gemini API key');
      return;
    }
    
    if (!outreachData.person.name || !outreachData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    setOutreachData(prev => ({
      ...prev,
      status: 'loading',
      emailContent: undefined,
      error: undefined
    }));
    
    try {
      const emailContent = await generatePersonalOutreach(apiKey, outreachData);
      
      setOutreachData(prev => ({
        ...prev,
        emailContent,
        status: 'success'
      }));
    } catch (error) {
      setOutreachData(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  const copyToClipboard = () => {
    if (outreachData.emailContent) {
      navigator.clipboard.writeText(outreachData.emailContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fluxor Personal Outreach</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create personalized outreach emails for building your Fluxor community, partnerships, and hackathon network
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Profile & Configuration
              </h2>
              <button 
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isConfigOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            {isConfigOpen && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your API key is used only for generating emails and isn't stored.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleFetchPersonInfo}
                      disabled={!linkedinUrl.includes('linkedin.com/in/')}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-1"
                    >
                      <Search className="w-4 h-4" />
                      Fetch
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Person Information
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{outreachData.person.name || 'No profile selected'}</span>
                    </div>
                    {outreachData.person.title && outreachData.person.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{outreachData.person.title} at {outreachData.person.company}</span>
                      </div>
                    )}
                    {outreachData.person.linkedin && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Linkedin className="w-3 h-3" />
                        <a href={outreachData.person.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {outreachData.person.twitter && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Twitter className="w-3 h-3" />
                        <a href={outreachData.person.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Twitter Profile
                        </a>
                      </div>
                    )}
                    {outreachData.person.bio && (
                      <p className="text-sm text-gray-600 mt-2">{outreachData.person.bio}</p>
                    )}
                    {outreachData.person.interests && outreachData.person.interests.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Interests:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {outreachData.person.interests.map((interest, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={outreachData.email}
                    onChange={(e) => setOutreachData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Their Email Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outreach Purpose
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {outreachPurposes.map((purpose) => (
                      <button
                        key={purpose.value}
                        onClick={() => setOutreachData(prev => ({ ...prev, outreachPurpose: purpose.value as any }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                          outreachData.outreachPurpose === purpose.value
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200 border'
                            : 'border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {purpose.icon}
                        <span>{purpose.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateEmail}
                  disabled={!apiKey || !outreachData.person.name || !outreachData.email || outreachData.status === 'loading'}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {outreachData.status === 'loading' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Personalized Outreach
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Email Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                Outreach Email Preview
              </h2>
              {outreachData.emailContent && (
                <button
                  onClick={copyToClipboard}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 min-h-96 bg-gray-50 relative overflow-auto">
              {outreachData.status === 'loading' ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-gray-600">Crafting your personalized outreach email...</p>
                  </div>
                </div>
              ) : outreachData.status === 'error' ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-center">Error: {outreachData.error}</p>
                  </div>
                </div>
              ) : outreachData.emailContent ? (
                <div className="whitespace-pre-line font-sans text-gray-800">
                  {outreachData.emailContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Mail className="w-12 h-12 mb-2" />
                  <p>Your personalized outreach email will appear here</p>
                  <p className="text-sm mt-1">Fill in the details and click "Generate"</p>
                </div>
              )}
            </div>
            
            {outreachData.emailContent && (
              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                <h3 className="text-sm font-medium text-indigo-800 mb-1">Outreach Tips</h3>
                <ul className="space-y-1">
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Add a personal touch before sending the email</div>
                  </li>
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Follow up within a week if you don't receive a response</div>
                  </li>
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Consider connecting on LinkedIn before or after sending the email</div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Fluxor | On-chain Hackathon Management Platform</p>
        </footer>
      </div>
    </div>
  );
};

export default FluxorPersonalOutreach;