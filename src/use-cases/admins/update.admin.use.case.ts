import { AdminsRepository } from '@/repositories/admins.repository'
import { AdminNotFoundError } from './err/admin.not.found.error'
import { Administrator, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

interface UpdateAdminUseCaseProps {
  adminId: string
  name?: string
  email?: string
  password?: string
  avatar?: string
  biography?: string
  location?: string
  socialLinks?: string[]
  interests?: string[] | null
  banner?: string
  favorites?: string[] | null
  role?: Role
}

interface UpdateAdminUseCaseResponse {
  admin: Administrator
}

export class UpdateAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
    name,
    email,
    password,
    avatar,
    biography,
    location,
    socialLinks,
    role,
    banner,
    favorites,
    interests,
  }: UpdateAdminUseCaseProps): Promise<UpdateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      throw new AdminNotFoundError()
    }

    const hashedPassword = password ? await hash(password, 12) : admin.password

    const updatedAdmin = await this.adminsRepository.update(adminId, {
      name: name || admin.name,
      email: email || admin.email,
      password: hashedPassword,
      avatar: avatar || admin.avatar,
      biography: biography || admin.biography,
      location: location || admin.location,
      socialLinks: socialLinks || admin.socialLinks,
      role: role || admin.role,
      banner: banner || admin.banner,
      favorites: {
        connect: favorites?.map((favorite) => ({ id: favorite })) || [],
      },
      interests: {
        connect: interests?.map((interest) => ({ id: interest })) || [],
      },
    })

    return {
      admin: updatedAdmin,
    }
  }
}
