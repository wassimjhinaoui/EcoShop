import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true }
      },
      async authorize(credentials) {
        // Ensure credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        // Check if this is a sign-up or sign-in attempt
        if (credentials.name) {
          // Sign-up logic
          const existingUser = await prisma.users.findUnique({
            where: { email: credentials.email }
          });

          if (existingUser) {
            throw new Error('User already exists');
          }

          const hashedPassword = await hash(credentials.password, 10);
          const user = await prisma.users.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
              id : uuidv4()
            }
          });

          return user;
        } else {
          // Sign-in logic
          const user = await prisma.users.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            throw new Error('No user found');
          }

          const isValidPassword = await compare(
            credentials.password, 
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return user;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    }
  },
  debug: true // Enable debug mode for more detailed logging
});

export { handler as GET, handler as POST };