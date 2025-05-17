export interface Person {
  name: string;
  linkedinUrl: string;
  // These will be populated by Gemini analysis
  title?: string;
  company?: string;
  email?: string;
  bio?: string;
}

export interface ProfileAnalysis {
  extractedInfo: {
    title: string;
    company: string;
    bio: string;
  };
  contentItems: ContentItem[];
  partnershipBenefits: PartnershipBenefit[];
}

export interface ContentItem {
  type: 'post' | 'article' | 'project' | 'achievement' | 'interest';
  content: string;
}

export interface PartnershipBenefit {
  forThem: string;
  forFluxor: string;
}

export interface OutreachOptions {
  messageType: 'email' | 'linkedin';
  purpose: 'partnership' | 'product';
}

export interface OutreachData {
  person: Person;
  profileAnalysis?: ProfileAnalysis;
  outreachOptions: OutreachOptions;
  emailContent?: string;
  status: 'idle' | 'analyzing' | 'analyzed' | 'generating' | 'success' | 'error';
  error?: string;
}

export type Tab = 'info' | 'options' | 'analysis' | 'email';