import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { customSession, emailOTP, oneTap } from 'better-auth/plugins'
import { APIError } from "better-auth/api";

import prisma from './prisma'
import { findUserDepots } from '@/utils/server';
import { User } from '@prisma/client';
import { transporter } from './mailer';



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        defaultValue: '',
      },
      mobile: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'seller',
      },
      depots: {
        type: 'number[]',
        required: false,
        defaultValue: [],
      },
      isAdmin: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: false,
      },
      payRateId: {
        type: 'number',
        required: false,
        defaultValue: null,
      }  
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  authUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      scope: ['profile', 'email'],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Kiểm tra email tồn tại trong DB của anh
          const existing = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existing) {
            // Chặn tạo user mới
            throw new APIError("UNAUTHORIZED", {
              message: "Email invalid.",
            });
          }

          // Nếu có rồi thì trả về user để tiếp tục tạo session
          return { data: user };  
        },
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name:  'bee_session'
      },
    },
    
  },
  trustedOrigins: [
    'http://localhost:9999',
    'https://admin.beeshoes.com.vn',
    'https://pos.beeshoes.com.vn',
    'https://staff.beeshoes.com.vn'
  ],
  plugins: [
    oneTap(),
    emailOTP({
          
          async sendVerificationOTP({ email, otp, type }) {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
              throw new APIError("UNAUTHORIZED", { message: "User not found" });
            }
            try {
              await transporter.sendMail({
                from: process.env.MAIL_FROM || 'noreply@beeshoes.com.vn',
                to: email,
                subject: `Your ${type} verification code`,
                text: `Your verification code is: ${otp}`,
                html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
              });
            } catch (error) {
              console.error('Error sending verification email:', error);
              throw new Error('Failed to send verification email');
            }
          }
        }),
    customSession(async ({ user, session }) => {
      const u = user as unknown as User;

      const depotNames = await findUserDepots(u.depots); 


      return {
        session,
        user: {
          ...u
        },
        depots: depotNames
      }
    })
  ],
  onAPIError: {
    throw: true,
    errorURL: "/sign-in?error",
  }
});
