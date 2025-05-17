import {
    AlertCircle,
    Building,
    CheckCircle,
    Copy,
    FileText,
    Loader,
    Mail,
    PlusCircle,
    RefreshCw,
    Sparkles,
    X
} from 'lucide-react';
import { useState } from 'react';

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Types
interface Person {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email: string;
}

interface ContentItem {
  type: 'post' | 'article' | 'project' | 'achievement' | 'interest';
  content: string;
}

interface PartnershipBenefit {
  forThem: string;
  forFluxor: string;
}

interface OutreachData {
  person: Person;
  contentItems: ContentItem[];
  partnershipBenefits: PartnershipBenefit[];
  emailContent?: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

// Helper functions for content analysis
const generateContentSuggestions = async (apiKey: string, linkedinUrl: string, name: string, title: string, company: string): Promise<ContentItem[]> => {
  // This would typically call Gemini to analyze their profile, but we'll simulate it for demo
  
  // In a real implementation, you would:
  // 1. Scrape their LinkedIn or use LinkedIn API
  // 2. Use Gemini to analyze their content and generate relevant items
  
  return [
    { type: 'post', content: 'Recently shared thoughts on the importance of interoperability in blockchain applications.' },
    { type: 'project', content: 'Led development of a cross-chain token bridge solution.' },
    { type: 'interest', content: 'Frequently engages with content about DeFi governance and DAO structures.' },
    { type: 'achievement', content: 'Recognized for contributions to open-source blockchain projects.' },
    { type: 'article', content: 'Published an article about scaling challenges in Web3 applications.' },
  ];
};

const generatePartnershipBenefits = async (apiKey: string, person: Person, contentItems: ContentItem[]): Promise<PartnershipBenefit[]> => {
  // This would typically call Gemini to suggest partnership benefits based on the person's profile
  
  return [
    { 
      forThem: "Access to Fluxor's network of blockchain developers and innovators through hackathon participation.",
      forFluxor: "Leverage their expertise in cross-chain solutions to improve our platform's interoperability features."
    },
    {
      forThem: "Opportunity to showcase their technology by hosting specialized challenges on our platform.",
      forFluxor: "Gain industry credibility through association with an established blockchain company."
    },
    {
      forThem: "Early access to innovative solutions and talent emerging from Fluxor hackathons.",
      forFluxor: "Expand our user base by connecting with their developer community."
    }
  ];
};

const generatePersonalizedOutreach = async (apiKey: string, outreachData: OutreachData): Promise<string> => {
  try {
    // Format content items as text
    const contentItemsText = outreachData.contentItems
      .map(item => `- ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.content}`)
      .join('\n');
    
    // Format partnership benefits as text
    const benefitsText = outreachData.partnershipBenefits
      .map(benefit => `- Benefit for them: ${benefit.forThem}\n  Benefit for Fluxor: ${benefit.forFluxor}`)
      .join('\n');
    
    const prompt = `
    You are writing a personalized partnership outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons with transparent on-chain governance.
    
    The recipient is:
    
    Name: ${outreachData.person.name}
    Title: ${outreachData.person.title}
    Company: ${outreachData.person.company}
    LinkedIn: ${outreachData.person.linkedinUrl}
    
    Key information about them based on their content and activity:
    ${contentItemsText}
    
    Potential partnership benefits:
    ${benefitsText}
    
    The email should:
    1. Be genuinely personalized based on their specific content, not generic patterns
    2. Reference 1-2 specific items from their content that connect to Fluxor's hackathon platform
    3. Propose a clear partnership opportunity that aligns with both their interests and Fluxor's offerings
    4. Be concise, professional but warm, and end with a specific call to action for a meeting
    5. Not mention "I saw your LinkedIn profile" or similar phrases - make it feel like a natural outreach
    6. Focus exclusively on partnership opportunities, not on inviting them to participate in hackathons
    7. Keep the tone conversational and not overly formal
    8. Be 150-250 words maximum
    
    Format your response as a complete email including subject line, greeting, body, and signature.
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

// Component for content item entry/edit
const ContentItemInput = ({ 
  item, 
  onChange, 
  onDelete, 
  index 
}: { 
  item: ContentItem, 
  onChange: (index: number, item: ContentItem) => void, 
  onDelete: (index: number) => void, 
  index: number 
}) => {
  return (
    <div className="flex gap-2 items-start mb-2">
      <select 
        value={item.type}
        onChange={(e) => onChange(index, { ...item, type: e.target.value as ContentItem['type'] })}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="post">Post</option>
        <option value="article">Article</option>
        <option value="project">Project</option>
        <option value="achievement">Achievement</option>
        <option value="interest">Interest</option>
      </select>
      <textarea
        value={item.content}
        onChange={(e) => onChange(index, { ...item, content: e.target.value })}
        placeholder="Enter content details..."
        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-8"
        rows={1}
      />
      <button
        onClick={() => onDelete(index)}
        className="text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Component for partnership benefit entry/edit
const BenefitInput = ({ 
  benefit, 
  onChange, 
  onDelete, 
  index 
}: { 
  benefit: PartnershipBenefit, 
  onChange: (index: number, benefit: PartnershipBenefit) => void, 
  onDelete: (index: number) => void, 
  index: number 
}) => {
  return (
    <div className="border border-gray-200 p-2 rounded-md mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">Partnership Benefit {index + 1}</span>
        <button
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">For them:</label>
        <textarea
          value={benefit.forThem}
          onChange={(e) => onChange(index, { ...benefit, forThem: e.target.value })}
          placeholder="What they gain from partnering with Fluxor..."
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">For Fluxor:</label>
        <textarea
          value={benefit.forFluxor}
          onChange={(e) => onChange(index, { ...benefit, forFluxor: e.target.value })}
          placeholder="What Fluxor gains from this partnership..."
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={2}
        />
      </div>
    </div>
  );
};

// Main component
const FluxorPartnershipOutreach = () => {
  const [apiKey, setApiKey] = useState('');
  const [outreachData, setOutreachData] = useState<OutreachData>({
    person: {
      name: '',
      title: '',
      company: '',
      linkedinUrl: '',
      email: ''
    },
    contentItems: [{ type: 'post', content: '' }],
    partnershipBenefits: [{ forThem: '', forFluxor: '' }],
    status: 'idle'
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'benefits'>('info');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeProfile = async () => {
    // Validation
    if (!apiKey) {
      alert('Please enter your Gemini API key');
      return;
    }
    
    if (!outreachData.person.linkedinUrl || !outreachData.person.name) {
      alert('Please enter at least a LinkedIn URL and name');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // In a real app, these would make actual API calls
      const contentSuggestions = await generateContentSuggestions(
        apiKey, 
        outreachData.person.linkedinUrl,
        outreachData.person.name,
        outreachData.person.title,
        outreachData.person.company
      );
      
      const benefitSuggestions = await generatePartnershipBenefits(
        apiKey,
        outreachData.person,
        contentSuggestions
      );
      
      setOutreachData(prev => ({
        ...prev,
        contentItems: contentSuggestions,
        partnershipBenefits: benefitSuggestions
      }));
      
      setActiveTab('content');
    } catch (error) {
      console.error('Error analyzing profile:', error);
      alert('Failed to analyze profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!apiKey) {
      alert('Please enter your Gemini API key');
      return;
    }
    
    // Validate necessary data
    if (
      !outreachData.person.name || 
      !outreachData.person.email ||
      outreachData.contentItems.length === 0 ||
      outreachData.partnershipBenefits.length === 0
    ) {
      alert('Please fill in all required information');
      return;
    }
    
    // Validate content items have actual content
    const hasEmptyContent = outreachData.contentItems.some(item => !item.content.trim());
    if (hasEmptyContent) {
      alert('Please fill in all content items or remove empty ones');
      return;
    }
    
    // Validate benefits have actual content
    const hasEmptyBenefit = outreachData.partnershipBenefits.some(
      benefit => !benefit.forThem.trim() || !benefit.forFluxor.trim()
    );
    if (hasEmptyBenefit) {
      alert('Please fill in all partnership benefits or remove empty ones');
      return;
    }
    
    setOutreachData(prev => ({
      ...prev,
      status: 'loading',
      emailContent: undefined,
      error: undefined
    }));
    
    try {
      const emailContent = await generatePersonalizedOutreach(apiKey, outreachData);
      
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

  // Content item handlers
  const handleContentItemChange = (index: number, updatedItem: ContentItem) => {
    const newItems = [...outreachData.contentItems];
    newItems[index] = updatedItem;
    setOutreachData(prev => ({ ...prev, contentItems: newItems }));
  };

  const handleAddContentItem = () => {
    setOutreachData(prev => ({
      ...prev,
      contentItems: [...prev.contentItems, { type: 'post', content: '' }]
    }));
  };

  const handleDeleteContentItem = (index: number) => {
    if (outreachData.contentItems.length <= 1) {
      alert('You need at least one content item');
      return;
    }
    
    const newItems = outreachData.contentItems.filter((_, i) => i !== index);
    setOutreachData(prev => ({ ...prev, contentItems: newItems }));
  };

  // Benefit handlers
  const handleBenefitChange = (index: number, updatedBenefit: PartnershipBenefit) => {
    const newBenefits = [...outreachData.partnershipBenefits];
    newBenefits[index] = updatedBenefit;
    setOutreachData(prev => ({ ...prev, partnershipBenefits: newBenefits }));
  };

  const handleAddBenefit = () => {
    setOutreachData(prev => ({
      ...prev,
      partnershipBenefits: [...prev.partnershipBenefits, { forThem: '', forFluxor: '' }]
    }));
  };

  const handleDeleteBenefit = (index: number) => {
    if (outreachData.partnershipBenefits.length <= 1) {
      alert('You need at least one partnership benefit');
      return;
    }
    
    const newBenefits = outreachData.partnershipBenefits.filter((_, i) => i !== index);
    setOutreachData(prev => ({ ...prev, partnershipBenefits: newBenefits }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fluxor Partnership Outreach</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create highly personalized partnership outreach emails based on real content and activities
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-500" />
                Partnership Builder
              </h2>
            </div>

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
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'info' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                Profile Info
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'content' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === 'benefits' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
            </div>

            {/* Profile Info Tab */}
            {activeTab === 'info' && (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={outreachData.person.name}
                      onChange={(e) => setOutreachData(prev => ({ 
                        ...prev, 
                        person: { ...prev.person, name: e.target.value } 
                      }))}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={outreachData.person.title}
                      onChange={(e) => setOutreachData(prev => ({ 
                        ...prev, 
                        person: { ...prev.person, title: e.target.value } 
                      }))}
                      placeholder="Job Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={outreachData.person.company}
                    onChange={(e) => setOutreachData(prev => ({ 
                      ...prev, 
                      person: { ...prev.person, company: e.target.value } 
                    }))}
                    placeholder="Company Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={outreachData.person.linkedinUrl}
                    onChange={(e) => setOutreachData(prev => ({ 
                      ...prev, 
                      person: { ...prev.person, linkedinUrl: e.target.value } 
                    }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={outreachData.person.email}
                    onChange={(e) => setOutreachData(prev => ({ 
                      ...prev, 
                      person: { ...prev.person, email: e.target.value } 
                    }))}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <button
                  onClick={handleAnalyzeProfile}
                  disabled={!apiKey || !outreachData.person.name || !outreachData.person.linkedinUrl || isAnalyzing}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Analyze Profile & Generate Suggestions
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Their Content & Activities</h3>
                  <button
                    onClick={handleAddContentItem}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add
                  </button>
                </div>
                
                <div className="mb-4 max-h-64 overflow-y-auto">
                  {outreachData.contentItems.map((item, index) => (
                    <ContentItemInput
                      key={index}
                      item={item}
                      index={index}
                      onChange={handleContentItemChange}
                      onDelete={handleDeleteContentItem}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setActiveTab('benefits')}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue to Partnership Benefits
                </button>
              </div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Partnership Benefits</h3>
                  <button
                    onClick={handleAddBenefit}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add
                  </button>
                </div>
                
                <div className="mb-4 max-h-64 overflow-y-auto">
                  {outreachData.partnershipBenefits.map((benefit, index) => (
                    <BenefitInput
                      key={index}
                      benefit={benefit}
                      index={index}
                      onChange={handleBenefitChange}
                      onDelete={handleDeleteBenefit}
                    />
                  ))}
                </div>
                
                <button
                  onClick={handleGenerateEmail}
                  disabled={
                    !apiKey || 
                    outreachData.status === 'loading' || 
                    !outreachData.person.name || 
                    !outreachData.person.email || 
                    outreachData.contentItems.length === 0 ||
                    outreachData.partnershipBenefits.length === 0
                  }
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {outreachData.status === 'loading' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Generate Partnership Email
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Email Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                Partnership Email
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
                    <p className="text-gray-600">Crafting your personalized partnership email...</p>
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
                  <FileText className="w-12 h-12 mb-2" />
                  <p>Your personalized partnership email will appear here</p>
                  <p className="text-sm mt-1">Fill in profile details and click "Generate"</p>
                </div>
              )}
            </div>
            
            {outreachData.emailContent && (
              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                <h3 className="text-sm font-medium text-indigo-800 mb-1">Partnership Outreach Tips</h3>
                <ul className="space-y-1">
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Review and personalize the email further before sending</div>
                  </li>
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Send from your personal work email, not a marketing address</div>
                  </li>
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Follow up within 5-7 days if you don't receive a response</div>
                  </li>
                  <li className="text-sm text-indigo-700 flex items-start gap-1">
                    <div className="min-w-4 mt-0.5">•</div>
                    <div>Connect on LinkedIn shortly after sending the email</div>
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

export default FluxorPartnershipOutreach;