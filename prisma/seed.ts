// prisma/seed.ts
import { PrismaClient, MessageType, MessagePurpose, MessageStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample profiles
  const profiles = [
    {
      name: 'John Doe',
      username: 'john-doe',
      linkedinUrl: 'https://linkedin.com/in/john-doe',
      title: 'Senior Blockchain Developer',
      company: 'ConsenSys',
      bio: 'Passionate about building decentralized applications with 5+ years in blockchain development.',
      location: 'San Francisco, CA',
      experience: '5+ years',
      skills: ['Solidity', 'Web3.js', 'React', 'Node.js', 'DeFi'],
      contentItems: [
        {
          type: 'post',
          content: 'Just wrapped up a fascinating project implementing cross-chain bridges.'
        },
        {
          type: 'article',
          content: 'Shared insights on "Gas Optimization Techniques in Solidity"'
        },
        {
          type: 'project',
          content: 'Lead developer on a DeFi yield farming protocol that reached $50M TVL'
        }
      ],
      partnershipBenefits: [
        {
          forThem: 'Access to cutting-edge hackathon projects and early-stage blockchain talent',
          forFluxor: 'Technical expertise in DeFi and smart contract development'
        }
      ]
    },
    {
      name: 'Jane Smith',
      username: 'jane-smith',
      linkedinUrl: 'https://linkedin.com/in/jane-smith',
      title: 'VP of Product',
      company: 'Chainlink Labs',
      bio: 'Product leader driving Web3 adoption through developer-first solutions.',
      location: 'New York, NY',
      experience: '8+ years',
      skills: ['Product Strategy', 'Web3', 'API Design', 'Developer Relations', 'Tokenomics'],
      contentItems: [
        {
          type: 'post',
          content: 'Excited about the growth in Web3 developer tools!'
        },
        {
          type: 'article',
          content: 'Published "The Future of Oracle Networks" discussing hybrid smart contracts'
        }
      ],
      partnershipBenefits: [
        {
          forThem: 'Platform to discover and support promising blockchain projects',
          forFluxor: 'Integration with Chainlink oracles for transparent judging'
        }
      ]
    }
  ];

  // Create profiles and messages
  for (const profileData of profiles) {
    const profile = await prisma.profile.upsert({
      where: { username: profileData.username },
      update: profileData,
      create: profileData,
    });

    // Create sample messages for each profile
    const messages = [
      {
        messageContent: `Subject: Strategic Partnership Opportunity - ${profile.company} x Fluxor

Hi ${profile.name},

I hope this email finds you well. I came across your profile and was genuinely impressed by your work as ${profile.title} at ${profile.company}.

Your expertise in ${profileData.skills[0]} and ${profileData.skills[1]} aligns perfectly with Fluxor's mission to revolutionize hackathon management through on-chain governance.

I'd love to explore how we could collaborate - whether through co-hosting hackathons on our platform, integrating ${profile.company}'s technology, or developing joint initiatives that benefit both our communities.

Would you be available for a brief call next week to discuss partnership opportunities?

Best regards,
Alex Rivera
Partnership Director, Fluxor`,
        messageType: MessageType.EMAIL,
        purpose: MessagePurpose.PARTNERSHIP,
        status: MessageStatus.PENDING,
      },
      {
        messageContent: `Hi ${profile.name}! 👋

Saw your impressive work at ${profile.company} - particularly your focus on ${profileData.skills[0]}. Really resonated with our mission at Fluxor.

We're building the future of hackathon management with on-chain governance, and I think ${profile.company} + Fluxor could create something amazing together.

Would love to explore partnership opportunities - maybe a quick 15-min call?

Best,
Alex from Fluxor 🚀`,
        messageType: MessageType.LINKEDIN,
        purpose: MessagePurpose.PARTNERSHIP,
        status: MessageStatus.APPROVED,
      },
      {
        messageContent: `Subject: Transform Your Innovation Programs with On-Chain Hackathons

Hi ${profile.name},

Hope you're doing well! I noticed your role as ${profile.title} at ${profile.company} and thought you'd be interested in how Fluxor is revolutionizing hackathon management.

Our platform offers:
• Transparent on-chain governance for fair judging
• Streamlined hackathon management and participant tracking
• Access to a curated network of blockchain developers
• Real-time analytics and automated prize distribution

Would you be interested in a quick demo?

Best regards,
Jordan Martinez
Solutions Consultant, Fluxor`,
        messageType: MessageType.EMAIL,
        purpose: MessagePurpose.PRODUCT,
        status: MessageStatus.REJECTED,
      }
    ];

    for (const messageData of messages) {
      await prisma.message.create({
        data: {
          ...messageData,
          profileId: profile.id,
        },
      });
    }

    console.log(`✅ Created profile and messages for ${profile.name}`);
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });