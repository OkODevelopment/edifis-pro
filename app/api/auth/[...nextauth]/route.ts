import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Handler NextAuth avec ton API externe
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("📩 Credentials reçus :", credentials)
    
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password
            })
        })
    
        const data = await response.json()
        console.log("🛬 Réponse de l'API backend :", data)
    
        if (!response.ok) {
            console.error("❌ Erreur de connexion - status :", response.status, data.message)
            return null
        }
    
        return {
            id: data.user.id.toString(),
            name: `${data.user.prenom} ${data.user.nom}`,
            email: data.user.email,
            role: data.user.role,
            token: data.token
        }
    }
    
    }),
  ],
  session: {
    strategy: "jwt", // Stocker la session dans un token JWT côté client
  },
  pages: {
    signIn: "/login", // La page de connexion
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;       // Ajouter le rôle récupéré via l'API
        token.accessToken = user.token; // Stocker le JWT venant de ton API (optionnel)
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;        // Ajouter le rôle dans la session
        session.user.accessToken = token.accessToken; // Ajouter le token dans la session
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
