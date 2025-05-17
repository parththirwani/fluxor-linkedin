# 🚀 Fluxor AI Partnership Outreach

## 📁 Project Structure

```
fluxor-linkedin/
├── src/
│   ├── components/
│   │   ├── AnalysisResultsTab.tsx      # Shows profile analysis results
│   │   ├── BenefitInput.tsx            # Individual benefit input (Legacy)
│   │   ├── ConfigurationPanel.tsx     # Main left panel container
│   │   ├── ContentItemInput.tsx       # Individual content input (Legacy)
│   │   ├── EmailPreview.tsx            # Right panel preview
│   │   ├── EmailTab.tsx                # Generated message display
│   │   ├── OutreachOptionsTab.tsx      # Message type & purpose selection
│   │   ├── ProfileInputTab.tsx         # Name & LinkedIn URL input
│   │   └── TabNavigation.tsx           # Tab navigation component
│   ├── hooks/
│   │   └── useOutreach.ts              # Main state management hook
│   ├── prompts/
│   │   ├── emailPrompts.ts             # Email generation prompts
│   │   └── linkedinPrompts.ts          # LinkedIn message prompts
│   ├── services/
│   │   └── geminiService.ts            # Gemini API integration
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces
│   ├── App.css                         # Global styles
│   ├── App.tsx                         # Main application component
│   ├── index.css                       # Tailwind imports
│   ├── main.tsx                        # Entry point
│   └── vite-env.d.ts                   # Vite types
├── public/
│   └── vite.svg                        # Vite logo
├── .gitignore                          # Git ignore rules
├── eslint.config.js                    # ESLint configuration
├── index.html                          # HTML template
├── package.json                        # Dependencies & scripts
├── pnpm-lock.yaml                      # Package lock file
├── README.md                           # Project documentation
├── tsconfig.app.json                   # App TypeScript config
├── tsconfig.json                       # Main TypeScript config
├── tsconfig.node.json                  # Node TypeScript config
└── vite.config.ts                      # Vite configuration
```

## 🔄 Application Flow

1. **Profile Input** (`ProfileInputTab`)
   - Enter name and LinkedIn URL
   - Click "Analyze Profile"

2. **Outreach Options** (`OutreachOptionsTab`)
   - Select message type: Email or LinkedIn
   - Choose purpose: Partnership or Product Introduction

3. **Analysis Results** (`AnalysisResultsTab`)
   - View extracted profile information
   - See key activities and content
   - Review partnership opportunities (if applicable)
   - Click "Generate [Message Type]"

4. **Generated Message** (`EmailTab`)
   - Review personalized message
   - Copy, download, or open in app
   - View sending tips and analysis

## 🤖 AI-Powered Features

### Profile Analysis
- Extracts title, company, and bio from LinkedIn
- Identifies recent posts, projects, and achievements
- Analyzes interests and professional activities

### Smart Message Generation
- **Partnership Emails**: Strategic collaboration proposals
- **Product Emails**: Platform introductions with value propositions
- **Partnership LinkedIn**: Casual networking for partnerships
- **Product LinkedIn**: Helpful recommendations for platform

### Dynamic Prompts
Each message type uses specialized prompts:
- Email prompts are longer and more formal
- LinkedIn prompts are shorter and conversational
- Partnership prompts focus on mutual benefits
- Product prompts highlight problem-solving value

## 🛠️ Technical Architecture

### State Management
- **useOutreach Hook**: Centralized state management
- **Gemini Service**: API communication layer
- **Type Safety**: Full TypeScript integration

### Component Structure
- **Modular Design**: Each tab is a separate component
- **Progressive Disclosure**: Tabs unlock as you complete steps
- **Responsive Layout**: Works on desktop and mobile

### Prompt Engineering
- **Template Variables**: Dynamic content insertion
- **Specialized Prompts**: Different approaches for each use case
- **Optimized Output**: Tailored length and tone for each platform

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```

3. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Paste it in the application

4. **Start Generating Outreach**
   - Enter a name and LinkedIn URL
   - Select your preferred message type and purpose
   - Let AI handle the rest!

## ✨ Key Features

- 🔍 **Automated Profile Analysis**: AI extracts all relevant information
- 📧 **Dual Message Types**: Email and LinkedIn options
- 🎯 **Purpose-Driven**: Partnership vs. Product approaches
- 📊 **Smart Analytics**: Word count, reading time, personalization level
- 💾 **Export Options**: Copy, download, or open in email/LinkedIn
- 🔄 **Progressive Workflow**: Clear steps with status indicators
- 📱 **Responsive Design**: Works seamlessly across devices

This optimized structure provides a clean, maintainable codebase for AI-powered partnership outreach with maximum flexibility and user experience.