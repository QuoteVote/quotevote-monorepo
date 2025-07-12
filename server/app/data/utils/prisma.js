import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
  }
  prisma = global.prisma
} else {
  prisma = new PrismaClient()
}

export default prisma
