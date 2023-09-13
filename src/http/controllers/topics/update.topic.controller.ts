import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateTopicUseCase } from '@/use-cases/factories/topics/make.update.use.case'
import { TopicNotFoundError } from '@/use-cases/topics/err/topic.not.found.error'

interface MultipartFile {
  path: string
}

export async function updateTopicController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.string(),
    courseId: z.string(),
  })

  const { title, description, order, courseId } = schema.parse(request.body)

  const { path: icon } = request.file as unknown as MultipartFile

  const { id } = request.params as { id: string }

  try {
    const updateTopicUseCase = makeUpdateTopicUseCase()

    const topic = await updateTopicUseCase.execute({
      id,
      title,
      icon,
      description,
      order,
      courseId,
    })

    return reply.status(200).send({ topic })
  } catch (error) {
    if (error instanceof TopicNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    return reply.status(500).send()
  }
}
