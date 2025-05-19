// prompts/emailPrompts.ts
export const PARTNERSHIP_EMAIL_PROMPT = `
You are writing a personalized partnership outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons with transparent on-chain governance and smart contract integration.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}
Location: {{location}}
Experience: {{experience}}
Skills: {{skills}}

Key information about them based on their LinkedIn profile analysis:
{{contentItems}}

Potential partnership benefits identified:
{{partnershipBenefits}}

Write a compelling partnership outreach email that:
1. Is genuinely personalized based on their specific LinkedIn content and professional background
2. References 1-2 specific items from their profile that connect to Fluxor's hackathon platform
3. Proposes a clear partnership opportunity that creates mutual value (e.g., technology integration, co-hosting hackathons, mentorship programs, strategic collaboration, or investment opportunities)
4. Is professional but warm and conversational (not overly formal or sales-y)
5. Includes a specific call-to-action for a meeting or call to discuss partnership details
6. Feels natural and authentic, not like a template
7. Is 200-300 words maximum
8. Focuses on long-term strategic collaboration rather than one-time transactions
9. Mentions specific benefits from the partnership analysis that align with their expertise

Format your response as a complete email including:
- Subject line (compelling and partnership-focused, mentioning both companies)
- Greeting
- Body paragraphs (2-3 paragraphs maximum)
- Professional signature (sign as representing Fluxor partnership team)

Make it feel like a genuine outreach from someone who took time to research their background and sees real potential for strategic partnership that benefits both organizations.
`;

export const PRODUCT_EMAIL_PROMPT = `
You are writing a personalized product outreach email for Fluxor (https://fluxor.io), an on-chain hackathon management platform that helps organize, run, and manage blockchain hackathons with transparent on-chain governance and smart contract integration.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}
Location: {{location}}
Experience: {{experience}}
Skills: {{skills}}

Key information about them based on their LinkedIn profile analysis:
{{contentItems}}

Write a compelling product introduction email that:
1. Is genuinely personalized based on their specific LinkedIn content and professional background
2. References 1-2 specific items from their profile that show why Fluxor would be valuable to them
3. Introduces Fluxor as a solution to challenges they might face (organizing hackathons, finding talent, managing innovation programs, transparent governance)
4. Explains key benefits relevant to their role: transparent on-chain governance, streamlined hackathon management, access to top blockchain talent, smart contract integration
5. Is professional but friendly and conversational
6. Includes a specific call-to-action to visit our platform, book a demo, or try our free trial
7. Feels natural and authentic, not like a sales pitch
8. Is 175-250 words maximum
9. Focuses on how Fluxor can solve their specific problems or enhance their work based on their profile

Format your response as a complete email including:
- Subject line (intriguing and value-focused, mentioning specific benefits for their role)
- Greeting
- Body paragraphs (2-3 paragraphs maximum)
- Professional signature (sign as representing Fluxor solutions team)
- P.S. with a compelling reason to check out the platform (mention a specific feature that aligns with their interests)

Make it feel like a helpful recommendation from someone who understands their needs and genuinely believes Fluxor can add value to their work in the blockchain/tech space.
`;