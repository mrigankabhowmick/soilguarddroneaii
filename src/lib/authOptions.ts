import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide all required fields");
        }

        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || user.authProvider !== 'local') {
          throw new Error("No user found or signed up via Google.");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password as string);

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "Google User",
            email: user.email || "",
            authProvider: "google",
            role: "Customer"
          });
        }
        // Attach role to user object so it's available in the jwt callback
        user.role = dbUser.role;
        user.id = dbUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // First time user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Periodic check or manual trigger
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      // If token role is missing for some reason, try to fetch it from DB (fallback)
      if (!token.role && token.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Adjust this to match the existing login page route
  },
  secret: process.env.NEXTAUTH_SECRET,
};
