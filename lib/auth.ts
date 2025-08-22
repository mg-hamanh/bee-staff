import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import {  customSession, oneTap } from 'better-auth/plugins'

import prisma from './prisma'
import { User } from './generated/prisma';
import { findUserDepots } from '@/utils/server';



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
      roleId: {
        type: 'number',
        required: true,
        defaultValue: 1, //1-nvbh, 2-nvtn, 3-cht, 
      },
      roleName: {
        type: 'string',
        required: false,
        defaultValue: 'Nhân viên bán hàng',
        input: false,
      },
      depots: {
        type: 'number[]',
        required: false,
        defaultValue: [],
      },
      isAdmin: {
        type: 'boolean',
        required: false,
        defaultValue: 'false',
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
  authUrl: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      scope: ['profile', 'email'],
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
    'https://pos.beeshoes.com.vn'
  ],
  plugins: [
    oneTap(),
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
  ]

});
