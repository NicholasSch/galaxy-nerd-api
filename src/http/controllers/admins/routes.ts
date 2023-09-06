import { FastifyInstance } from 'fastify'
import multer from 'fastify-multer'

import { register } from './register.controller'
import { createCloudinaryStorage } from '@/utils/storage'
import { authenticateAdminController } from './authenticate.controller'

const upload = multer({
  storage: createCloudinaryStorage(),
})

export async function adminsRoutes(app: FastifyInstance) {
  app.post('/admins', { preHandler: upload.single('avatar') }, register)
  app.post('/admins/sessions', authenticateAdminController)
}
