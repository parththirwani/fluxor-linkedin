// utils/csvUtils.ts - Enhanced with LinkedIn URL support
import { extractUsernameFromLinkedInUrl, validateLinkedInUrl, normalizeLinkedInUrl } from '../services/profileService';

export const parseCsvFile = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        // Skip header row if it exists (check if first row contains common header terms)
        const firstLine = lines[0]?.toLowerCase() || '';
        const hasHeader = firstLine.includes('linkedin') || 
                         firstLine.includes('username') || 
                         firstLine.includes('profile') ||
                         firstLine.includes('name') ||
                         firstLine.includes('url');
        
        const startIndex = hasHeader ? 1 : 0;
        
        if (lines.length <= startIndex) {
          reject(new Error('CSV file contains no data rows'));
          return;
        }
        
        // Extract usernames/URLs from the first column
        const extractedUsernames: string[] = [];
        const errors: string[] = [];
        
        lines.slice(startIndex).forEach((line, index) => {
          // Handle both comma and semicolon separators, also handle quoted values
          const cols = line.split(/[,;]/).map(col => col.trim().replace(/^["']|["']$/g, ''));
          
          if (cols.length === 0 || !cols[0]) {
            errors.push(`Row ${index + startIndex + 1}: Empty value`);
            return;
          }
          
          let input = cols[0].trim();
          
          // Skip obviously invalid entries
          if (input.toLowerCase().includes('linkedin') && 
              input.toLowerCase().includes('username') ||
              input.toLowerCase().includes('profile') ||
              input.toLowerCase().includes('name')) {
            return; // Skip header-like entries
          }
          
          let username = '';
          
          // Check if it's a LinkedIn URL
          if (input.includes('linkedin.com')) {
            const normalizedUrl = normalizeLinkedInUrl(input);
            
            if (validateLinkedInUrl(normalizedUrl)) {
              const extractedUsername = extractUsernameFromLinkedInUrl(normalizedUrl);
              if (extractedUsername) {
                username = extractedUsername;
              } else {
                errors.push(`Row ${index + startIndex + 1}: Could not extract username from URL: ${input}`);
                return;
              }
            } else {
              errors.push(`Row ${index + startIndex + 1}: Invalid LinkedIn URL: ${input}`);
              return;
            }
          } else {
            // Treat as username directly
            username = input.replace(/^@/, ''); // Remove @ if present
            
            // Basic username validation
            if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(username) || 
                username.length < 3 || username.length > 100) {
              errors.push(`Row ${index + startIndex + 1}: Invalid username format: ${input}`);
              return;
            }
          }
          
          if (username && !extractedUsernames.includes(username)) {
            extractedUsernames.push(username);
          }
        });
        
        if (extractedUsernames.length === 0) {
          if (errors.length > 0) {
            reject(new Error(`No valid LinkedIn profiles found. Errors:\n${errors.join('\n')}`));
          } else {
            reject(new Error('No valid LinkedIn profiles found in the CSV file'));
          }
          return;
        }
        
        // Log warnings for errors but still proceed if we have some valid entries
        if (errors.length > 0) {
          console.warn('CSV parsing warnings:', errors);
        }
        
        resolve(extractedUsernames);
      } catch (error) {
        reject(new Error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const downloadAsJson = (data: any, filename: string) => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading JSON file:', error);
    throw new Error('Failed to download JSON file');
  }
};

export const downloadAsCsv = (data: any[], filename: string) => {
  try {
    if (data.length === 0) {
      throw new Error('No data to export');
    }
    
    // Get all unique keys from all objects
    const allKeys = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    );
    
    // Create CSV header
    const headers = allKeys.join(',');
    
    // Create CSV rows
    const csvContent = [
      headers,
      ...data.map(row => 
        allKeys.map(key => {
          const value = row[key];
          // Handle different data types and escape quotes
          if (value === null || value === undefined) return '';
          const stringValue = String(value).replace(/"/g, '""');
          // Wrap in quotes if contains comma, newline, or quote
          return /[,\n"]/.test(stringValue) ? `"${stringValue}"` : stringValue;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV file:', error);
    throw new Error('Failed to download CSV file');
  }
};

// Helper function to validate LinkedIn username
export const validateLinkedInUsername = (username: string): boolean => {
  // LinkedIn usernames can contain letters, numbers, and hyphens
  // They cannot start or end with a hyphen
  const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
  return usernameRegex.test(username) && username.length >= 3 && username.length <= 100;
};

// Helper function to extract username from LinkedIn URL
export const extractUsernameFromUrl = (url: string): string | null => {
  try {
    const match = url.match(/linkedin\.com\/in\/([^\/?\s]+)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

// Helper function to format data for export
export const formatExportData = (messages: any[], includeMetadata: boolean = true) => {
  return messages.map(message => {
    const baseData = {
      name: message.profileData?.name || '',
      username: message.profileData?.username || '',
      linkedinUrl: message.profileData?.linkedinUrl || '',
      title: message.profileData?.title || '',
      company: message.profileData?.company || '',
      messageType: message.messageType || '',
      purpose: message.purpose || '',
      status: message.status || '',
      messageContent: message.messageContent || ''
    };
    
    if (includeMetadata) {
      return {
        ...baseData,
        id: message.id || '',
        generatedAt: message.generatedAt ? new Date(message.generatedAt).toISOString() : '',
        bio: message.profileData?.bio || ''
      };
    }
    
    return baseData;
  });
};

// Generate a sample CSV template for download
export const generateSampleCsv = (): string => {
  const sampleData = [
    'LinkedIn Profile',
    'https://linkedin.com/in/john-doe',
    'https://linkedin.com/in/jane-smith',
    'linkedin.com/in/alex-johnson',
    'bob-wilson',
    'sarah-chen'
  ];
  
  return sampleData.join('\n');
};

// Download sample CSV template
export const downloadSampleCsv = () => {
  const csvContent = generateSampleCsv();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'linkedin-profiles-template.csv';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};