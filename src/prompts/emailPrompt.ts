export const PARTNERSHIP_EMAIL_PROMPT = `
You are writing a personalized partnership outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons with transparent on-chain governance.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}

Key information about them based on their LinkedIn profile analysis:
{{contentItems}}

Potential partnership benefits identified:
{{partnershipBenefits}}

Write a compelling partnership outreach email that:
1. Is genuinely personalized based on their specific LinkedIn content and professional background
2. References 1-2 specific items from their profile that connect to Fluxor's hackathon platform
3. Proposes a clear partnership opportunity that creates mutual value (e.g., technology integration, co-hosting hackathons, mentorship programs, or strategic collaboration)
4. Is professional but warm and conversational (not overly formal or sales-y)
5. Includes a specific call-to-action for a meeting or call to discuss partnership details
6. Feels natural and authentic, not like a template
7. Is 175-250 words maximum
8. Focuses on long-term collaboration rather than one-time transactions

Format your response as a complete email including:
- Subject line (compelling and partnership-focused)
- Greeting
- Body paragraphs (2-3 paragraphs maximum)
- Professional signature (sign as representing Fluxor)

Make it feel like a genuine outreach from someone who took time to research their background and sees real potential for strategic partnership.
`;

export const PRODUCT_EMAIL_PROMPT = `
You are writing a personalized product outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons with transparent on-chain governance.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}

Key information about them based on their LinkedIn profile analysis:
{{contentItems}}

Write a compelling product introduction email that:
1. Is genuinely personalized based on their specific LinkedIn content and professional background
2. References 1-2 specific items from their profile that show why Fluxor would be valuable to them
3. Introduces Fluxor as a solution to challenges they might face (organizing hackathons, finding talent, managing innovation programs)
4. Explains key benefits: transparent on-chain governance, streamlined hackathon management, access to top blockchain talent
5. Is professional but friendly and conversational
6. Includes a specific call-to-action to visit our platform or book a demo
7. Feels natural and authentic, not like a sales pitch
8. Is 150-200 words maximum
9. Focuses on how Fluxor can solve their specific problems or enhance their work

Format your response as a complete email including:
- Subject line (intriguing and value-focused)
- Greeting
- Body paragraphs (2 paragraphs maximum)
- Professional signature (sign as representing Fluxor)
- P.S. with a compelling reason to check out the platform

Make it feel like a helpful recommendation from someone who understands their needs and genuinely believes Fluxor can add value to their work.
`;