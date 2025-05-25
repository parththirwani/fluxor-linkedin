// hooks/useProcessing.ts - Updated with database integration
import { useCallback } from 'react';
import { analyzeLinkedInProfile, generateMessage } from '../services/profileService';
import { parseCsvFile } from '../utils/csvUtils';
import DatabaseService from '../services/databaseService';
import { MessageType, MessagePurpose } from '@prisma/client';

// Define types locally to avoid dependency issues
interface ProfileData {
  name: string;
  username: string;
  linkedinUrl: string;
  title?: string;
  company?: string;
  bio?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  contentItems?: any[];
  partnershipBenefits?: any[];
}

interface GeneratedMessage {
  id: string;
  profileData: ProfileData;
  messageContent: string;
  messageType: 'email' | 'linkedin';
  purpose: 'partnership' | 'product';
  status: 'pending' | 'approved' | 'rejected';
  generatedAt: Date;
}

interface MessageConfig {
  messageType: 'email' | 'linkedin';
  purpose: 'partnership' | 'product';
}

interface UseProcessingProps {
  apiKey: string;
  messageConfig: MessageConfig;
  onMessagesGenerated: (messages: GeneratedMessage[]) => void;
  onProgressUpdate: (current: number, total: number) => void;
  onProcessingStart: () => void;
  onProcessingComplete: () => void;
  onError: (error: string) => void;
}

export const useProcessing = ({
  apiKey,
  messageConfig,
  onMessagesGenerated,
  onProgressUpdate,
  onProcessingStart,
  onProcessingComplete,
  onError
}: UseProcessingProps) => {
  
  const processSingleProfile = useCallback(async (username: string, personName?: string) => {
    if (!apiKey || !username) {
      onError('Please enter API key and LinkedIn username');
      return;
    }

    onProcessingStart();

    try {
      // Convert username to LinkedIn URL format for the analyzeLinkedInProfile function
      const linkedinUrl = username.includes('linkedin.com') 
        ? username 
        : `https://linkedin.com/in/${username}`;
        
      const profileData = await analyzeLinkedInProfile(linkedinUrl, apiKey);
      
      // If personName is provided, use it instead of the extracted name
      if (personName) {
        profileData.name = personName;
      }
      
      const messageContent = await generateMessage(
        profileData, 
        messageConfig.messageType, 
        messageConfig.purpose,
        apiKey
      );

      // Save to database
      const savedProfile = await DatabaseService.createProfile(profileData);
      const savedMessage = await DatabaseService.createMessage(
        savedProfile.id,
        messageContent,
        messageConfig.messageType.toUpperCase() as MessageType,
        messageConfig.purpose.toUpperCase() as MessagePurpose
      );

      // Convert to GeneratedMessage format
      const message: GeneratedMessage = DatabaseService.convertToGeneratedMessage(savedMessage);

      onMessagesGenerated([message]);
      onProcessingComplete();
    } catch (error) {
      console.error('Error processing profile:', error);
      onError(error instanceof Error ? error.message : 'Failed to process profile');
    }
  }, [apiKey, messageConfig, onMessagesGenerated, onProcessingStart, onProcessingComplete, onError]);

  const processBulkProfiles = useCallback(async (csvFile: File) => {
    if (!apiKey || !csvFile) {
      onError('Please enter API key and upload CSV file');
      return;
    }

    onProcessingStart();

    try {
      const usernames = await parseCsvFile(csvFile);
      const messages: GeneratedMessage[] = [];

      onProgressUpdate(0, usernames.length);

      for (let i = 0; i < usernames.length; i++) {
        const username = usernames[i];
        onProgressUpdate(i + 1, usernames.length);

        try {
          // Convert username to LinkedIn URL format
          const linkedinUrl = username.includes('linkedin.com') 
            ? username 
            : `https://linkedin.com/in/${username}`;
            
          const profileData = await analyzeLinkedInProfile(linkedinUrl, apiKey);
          const messageContent = await generateMessage(
            profileData, 
            messageConfig.messageType, 
            messageConfig.purpose,
            apiKey
          );

          // Save to database
          const savedProfile = await DatabaseService.createProfile(profileData);
          const savedMessage = await DatabaseService.createMessage(
            savedProfile.id,
            messageContent,
            messageConfig.messageType.toUpperCase() as MessageType,
            messageConfig.purpose.toUpperCase() as MessagePurpose
          );

          // Convert to GeneratedMessage format
          const message = DatabaseService.convertToGeneratedMessage(savedMessage);
          messages.push(message);
          
          // Add a small delay to avoid rate limiting
          if (i < usernames.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          console.error(`Error processing ${username}:`, error);
          // Continue processing other profiles even if one fails
        }
      }

      if (messages.length === 0) {
        onError('Failed to process any profiles from the CSV file');
        return;
      }

      onMessagesGenerated(messages);
      onProcessingComplete();
    } catch (error) {
      console.error('Error processing CSV:', error);
      onError(error instanceof Error ? error.message : 'Failed to process CSV file');
    }
  }, [apiKey, messageConfig, onMessagesGenerated, onProgressUpdate, onProcessingStart, onProcessingComplete, onError]);

  return {
    processSingleProfile,
    processBulkProfiles
  };
};