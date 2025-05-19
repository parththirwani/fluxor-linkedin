// utils/csvUtils.ts
export const parseCsvFile = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row if it exists (check if first row contains common header terms)
        const firstLine = lines[0]?.toLowerCase() || '';
        const hasHeader = firstLine.includes('linkedin') || 
                         firstLine.includes('username') || 
                         firstLine.includes('profile') ||
                         firstLine.includes('name');
        
        const startIndex = hasHeader ? 1 : 0;
        
        // Extract usernames from the first column
        const usernames = lines.slice(startIndex).map(line => {
          // Handle both comma and semicolon separators
          const cols = line.split(/[,;]/).map(col => col.trim());
          
          // Remove quotes if present
          let username = cols[0]?.replace(/["']/g, '') || '';
          
          // If it's a full LinkedIn URL, extract just the username
          if (username.includes('linkedin.com/in/')) {
            const match = username.match(/linkedin\.com\/in\/([^\/?\s]+)/);
            username = match ? match[1] : username;
          }
          
          return username;
        }).filter(username => {
          // Filter out empty usernames and common header terms
          return username && 
                 !username.toLowerCase().includes('linkedin') &&
                 !username.toLowerCase().includes('username') &&
                 !username.toLowerCase().includes('profile') &&
                 !username.toLowerCase().includes('name');
        });
        
        resolve(usernames);
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