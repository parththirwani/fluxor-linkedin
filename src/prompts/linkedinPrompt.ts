// prompts/linkedinPrompts.ts
export const PARTNERSHIP_LINKEDIN_PROMPT = `
You are writing a personalized partnership outreach LinkedIn message for Fluxor (https://fluxor.io), an on-chain hackathon management platform.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}
Skills: {{skills}}

Key information about them:
{{contentItems}}

Partnership benefits:
{{partnershipBenefits}}

Write a compelling LinkedIn message that:
1. Is personalized based on their profile
2. Mentions a specific item from their background
3. Proposes a clear partnership opportunity
4. Is casual and conversational (LinkedIn style)
5. Is 100-150 words maximum
6. Includes a simple call-to-action
7. Uses appropriate emojis sparingly

Format as a direct LinkedIn message (no subject line needed).
`;

export const PRODUCT_LINKEDIN_PROMPT = `
You are writing a personalized product introduction LinkedIn message for Fluxor (https://fluxor.io), an on-chain hackathon management platform.

The recipient is:

Name: {{name}}
Title: {{title}}
Company: {{company}}
LinkedIn: {{linkedinUrl}}
Bio: {{bio}}
Skills: {{skills}}

Key information about them:
{{contentItems}}

Write a compelling LinkedIn message that:
1. Is personalized based on their profile
2. References their specific role/expertise
3. Introduces Fluxor as valuable for their work
4. Mentions specific benefits for their role
5. Is casual and friendly (LinkedIn style)
6. Is 80-120 words maximum
7. Includes a simple call-to-action
8. Uses appropriate emojis sparingly

Format as a direct LinkedIn message (no subject line needed).
`;