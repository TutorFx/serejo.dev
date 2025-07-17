import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

let _prisma: PrismaClientExtended

export function usePrisma(): PrismaClientExtended {
  if (!_prisma) {
    _prisma = prismaClientSingleton()
  }
  return _prisma
}