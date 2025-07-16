import { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient

export function usePrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }
  return _prisma
}