// hooks/useProcessing.ts
import { useCallback } from 'react';
import { GeneratedMessage, MessageConfig } from '../types';
import { analyzeLinkedInProfile, generateMessage } from '../services/profileService';
import { parseCsvFile } from '../utils/csvUtils';

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
  
  const processSingleProfile = useCallback(async (username: string) => {
    if (!apiKey || !username) {
      onError('Please enter API key and LinkedIn username');
      return;
    }

    onProcessingStart();

    try {
      const profileData = await analyzeLinkedInProfile(username);
      const messageContent = await generateMessage(
        profileData, 
        messageConfig.messageType, 
        messageConfig.purpose
        // Note: apiKey removed since mock implementation doesn't use it
      );

      const message: GeneratedMessage = {
        id: Date.now().toString(),
        profileData,
        messageContent,
        messageType: messageConfig.messageType,
        purpose: messageConfig.purpose,
        status: 'pending',
        generatedAt: new Date()
      };

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
          const profileData = await analyzeLinkedInProfile(username);
          const messageContent = await generateMessage(
            profileData, 
            messageConfig.messageType, 
            messageConfig.purpose
            // Note: apiKey removed since mock implementation doesn't use it
          );

          messages.push({
            id: `${Date.now()}-${i}`,
            profileData,
            messageContent,
            messageType: messageConfig.messageType,
            purpose: messageConfig.purpose,
            status: 'pending',
            generatedAt: new Date()
          });
        } catch (error) {
          console.error(`Error processing ${username}:`, error);
          // Continue processing other profiles even if one fails
        }
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