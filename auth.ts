import NextAuth from 'next-auth'
import credentials from 'next-auth/providers/credentials'
import db from './lib/db'
import { compareSync } from 'bcrypt-ts'

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@exemplo.com.br'
        },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string
        //console.log(credentials)

        if (!credentials.email) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: email }
        })

        if (!user) {
          return null
        }

        const passwordMatch = compareSync(password, user.password ?? '')

        if (!passwordMatch) {
          return null
        }

        return user
      }
    })
  ]
})
