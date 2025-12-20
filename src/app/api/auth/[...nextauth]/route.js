import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BASEURL || "http://localhost:9000";
          console.log(`Syncing user with backend at: ${backendUrl}/api/auth/google`);

          const response = await fetch(`${backendUrl}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: user.id || account.providerAccountId,
              idToken: account.id_token, 
              accessToken: account.access_token, // Send Google access token too if backend needs it
            }),
          });

          if (!response.ok) {
            console.error(`Backend sync failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Backend response:", text);
            // Decide if you want to block login on backend failure:
            // return false; 
            // For now, allow login but warn
            return true;
          }

          const data = await response.json();
          console.log("Backend sync success:", data);

          // If backend returns a token, attach it to the user object to persist in session
          if (data && (data.token || data.accessToken)) {
            user.backendAccessToken = data.token || data.accessToken;
          }
           // If backend returns user info, update it
          if (data && data.user) {
             user.backendUser = data.user;
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true; // prevent lockout on error for now
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.backendAccessToken = user.backendAccessToken;
        token.backendUser = user.backendUser;
        token.idToken = account?.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.backendAccessToken; // Expose backend token as the main accessToken
      session.user.id = token.sub;
      session.user = { ...session.user, ...token.backendUser }; // Merge backend user data
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
