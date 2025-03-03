import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Normalement, on utiliserait une vraie base de données ici
// Ceci est juste pour la démonstration
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@edificepro.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "User",
    email: "user@edificepro.com",
    password: "user123",
    role: "user",
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(user => user.email === credentials.email)

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }