// src/services/databaseService.ts
import { PrismaClient, MessageStatus, MessageType, MessagePurpose } from '@prisma/client';
import { ProfileData, GeneratedMessage, ContentItem, PartnershipBenefit } from '../types';

const prisma = new PrismaClient();

export class DatabaseService {
  static async createProfile(profileData: ProfileData) {
    try {
      return await prisma.profile.upsert({
        where: { username: profileData.username },
        update: {
          name: profileData.name,
          linkedinUrl: profileData.linkedinUrl,
          title: profileData.title,
          company: profileData.company,
          bio: profileData.bio,
          location: profileData.location,
          experience: profileData.experience,
          skills: profileData.skills || [],
          contentItems: profileData.contentItems as any,
          partnershipBenefits: profileData.partnershipBenefits as any,
        },
        create: {
          name: profileData.name,
          username: profileData.username,
          linkedinUrl: profileData.linkedinUrl,
          title: profileData.title,
          company: profileData.company,
          bio: profileData.bio,
          location: profileData.location,
          experience: profileData.experience,
          skills: profileData.skills || [],
          contentItems: profileData.contentItems as any,
          partnershipBenefits: profileData.partnershipBenefits as any,
        },
      });
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      throw new Error('Failed to save profile to database');
    }
  }

  static async createMessage(
    profileId: string,
    messageContent: string,
    messageType: MessageType,
    purpose: MessagePurpose
  ) {
    try {
      return await prisma.message.create({
        data: {
          profileId,
          messageContent,
          messageType,
          purpose,
          status: MessageStatus.PENDING,
        },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to save message to database');
    }
  }

  static async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    reviewedBy?: string
  ) {
    try {
      const updateData: any = {
        status,
        reviewedBy,
      };

      if (status === MessageStatus.APPROVED) {
        updateData.approvedAt = new Date();
      } else if (status === MessageStatus.REJECTED) {
        updateData.rejectedAt = new Date();
      }

      return await prisma.message.update({
        where: { id: messageId },
        data: updateData,
        include: {
          profile: true,
        },
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error('Failed to update message status');
    }
  }

  static async getMessages(
    limit?: number,
    offset?: number,
    status?: MessageStatus,
    messageType?: MessageType,
    purpose?: MessagePurpose
  ) {
    try {
      const where: any = {};
      
      if (status) where.status = status;
      if (messageType) where.messageType = messageType;
      if (purpose) where.purpose = purpose;

      const [messages, total] = await Promise.all([
        prisma.message.findMany({
          where,
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: offset,
        }),
        prisma.message.count({ where }),
      ]);

      return { messages, total };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages from database');
    }
  }

  static async getMessageById(messageId: string) {
    try {
      return await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      console.error('Error fetching message:', error);
      throw new Error('Failed to fetch message from database');
    }
  }

  static async getProfile(username: string) {
    try {
      return await prisma.profile.findUnique({
        where: { username },
        include: {
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile from database');
    }
  }

  static async getMessageStats() {
    try {
      const [pending, approved, rejected, total] = await Promise.all([
        prisma.message.count({ where: { status: MessageStatus.PENDING } }),
        prisma.message.count({ where: { status: MessageStatus.APPROVED } }),
        prisma.message.count({ where: { status: MessageStatus.REJECTED } }),
        prisma.message.count(),
      ]);

      return {
        pending,
        approved,
        rejected,
        total,
      };
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw new Error('Failed to fetch message statistics');
    }
  }

  static async deleteMessage(messageId: string) {
    try {
      return await prisma.message.delete({
        where: { id: messageId },
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  static async searchMessages(query: string, limit = 20, offset = 0) {
    try {
      const [messages, total] = await Promise.all([
        prisma.message.findMany({
          where: {
            OR: [
              {
                profile: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                profile: {
                  company: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                profile: {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                messageContent: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: offset,
        }),
        prisma.message.count({
          where: {
            OR: [
              {
                profile: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                profile: {
                  company: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                profile: {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                messageContent: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      ]);

      return { messages, total };
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('Failed to search messages');
    }
  }

  // Convert database message to GeneratedMessage format
  static convertToGeneratedMessage(dbMessage: any): GeneratedMessage {
    return {
      id: dbMessage.id,
      profileData: {
        name: dbMessage.profile.name,
        username: dbMessage.profile.username,
        linkedinUrl: dbMessage.profile.linkedinUrl,
        title: dbMessage.profile.title,
        company: dbMessage.profile.company,
        bio: dbMessage.profile.bio,
        location: dbMessage.profile.location,
        experience: dbMessage.profile.experience,
        skills: dbMessage.profile.skills,
        contentItems: dbMessage.profile.contentItems as ContentItem[],
        partnershipBenefits: dbMessage.profile.partnershipBenefits as PartnershipBenefit[],
      },
      messageContent: dbMessage.messageContent,
      messageType: dbMessage.messageType.toLowerCase() as 'email' | 'linkedin',
      purpose: dbMessage.purpose.toLowerCase() as 'partnership' | 'product',
      status: dbMessage.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
      generatedAt: dbMessage.generatedAt,
    };
  }

  // Close the database connection
  static async disconnect() {
    await prisma.$disconnect();
  }
}

export default DatabaseService;