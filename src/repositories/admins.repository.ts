import { Prisma, Administrator } from '@prisma/client'

export interface AdminsRepository {
  create(data: Prisma.AdministratorCreateInput): Promise<Administrator>
  findByEmail(email: string): Promise<Administrator | null>
}
