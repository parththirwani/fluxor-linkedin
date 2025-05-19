// types/index.ts (Updated)
export interface ProfileData {
  name: string;
  username: string;
  linkedinUrl: string;
  title?: string;
  company?: string;
  bio?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  contentItems?: ContentItem[];
  partnershipBenefits?: PartnershipBenefit[];
}

export interface ContentItem {
  type: 'post' | 'article' | 'project' | 'achievement' | 'interest';
  content: string;
}

export interface PartnershipBenefit {
  forThem: string;
  forFluxor: string;
}

export interface GeneratedMessage {
  id: string;
  profileData: ProfileData;
  messageContent: string;
  messageType: 'email' | 'linkedin';
  purpose: 'partnership' | 'product';
  status: 'pending' | 'approved' | 'rejected';
  generatedAt: Date;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  percentage: number;
}

export type ProcessingMode = 'single' | 'bulk';
export type ApplicationStep = 'setup' | 'processing' | 'review';
export type MessageType = 'email' | 'linkedin';
export type MessagePurpose = 'partnership' | 'product';

export interface MessageConfig {
  messageType: MessageType;
  purpose: MessagePurpose;
}

export interface AppState {
  apiKey: string;
  mode: ProcessingMode;
  currentStep: ApplicationStep;
  messageConfig: MessageConfig;
  singleUsername: string;
  csvFile: File | null;
  generatedMessages: GeneratedMessage[];
  currentMessageIndex: number;
  isProcessing: boolean;
  processingProgress: ProcessingProgress;
}