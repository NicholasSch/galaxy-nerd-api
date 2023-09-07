import { FastifyInstance } from 'fastify'
import multer from 'fastify-multer'

import { authenticateInstructorController } from './authenticate.controller'
import { createCloudinaryStorage } from '@/utils/storage'
import { register } from './register.controller'
import { deleteInstructorController } from './delete.instructor.controller'
import { getInstructorProfile } from './get.instructor.profile.controller'
import { getAllInstructors } from './get.all.instructors.controller'
import { update } from './update.instructor.controller'

const upload = multer({
  storage: createCloudinaryStorage(),
})

export async function instructorsRoutes(app: FastifyInstance) {
  app.post('/instructors/sessions', authenticateInstructorController)
  app.post('/instructors', { preHandler: upload.single('avatar') }, register)
  app.get('/instructors/:instructorId', getInstructorProfile)
  app.put(
    '/instructors/:instructorId',
    { preHandler: upload.single('avatar') },
    update,
  )
  app.get('/instructors', getAllInstructors)
  app.delete('/instructors/:instructorId', deleteInstructorController)
}
