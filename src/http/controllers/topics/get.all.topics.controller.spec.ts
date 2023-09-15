import request from 'supertest'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import path from 'path'
import fs from 'fs'

import { app } from '@/app'

const avatar = fs.readFileSync(
  path.resolve(__dirname, '..', 'tests', 'assets', 'avatar.png'),
)

describe('Get All Topics Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get all topics', async () => {
    const instructor = await request(app.server)
      .post('/instructors')
      .field('name', 'John Doe')
      .field('email', 'johndoe@gmail.com')
      .field('password', '@17Edilson17')
      .field('biography', 'I am a developer')
      .field('socialLinks', 'twitter')
      .field('socialLinks', 'facebook')
      .field('socialLinks', 'linkedin')
      .field('role', 'INSTRUCTOR')
      .field('location', 'Lagos')
      .attach('avatar', avatar)

    const auth = await request(app.server).post('/instructors/sessions').send({
      email: 'johndoe@gmail.com',
      password: '@17Edilson17',
    })

    const { token } = auth.body

    const category = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'any_name')
      .field('description', 'any_description')
      .attach('icon', avatar)

    const course = await request(app.server)
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Course title')
      .field('description', 'Course description')
      .field('price', '250')
      .field('categoryId', category.body.category.category.id)
      .field('instructorId', instructor.body.instructor.instructor.id)
      .attach('thumbnail', avatar)

    await request(app.server)
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'any_title')
      .field('order', 0)
      .field('courseId', course.body.course.course.id)
      .field('description', 'any_description')
      .attach('icon', avatar)

    await request(app.server)
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'new_title')
      .field('order', 1)
      .field('courseId', course.body.course.course.id)
      .field('description', 'any_description')
      .attach('icon', avatar)

    await request(app.server)
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'another_new_title')
      .field('order', 2)
      .field('courseId', course.body.course.course.id)
      .field('description', 'any_description')
      .attach('icon', avatar)

    const response = await request(app.server)
      .get('/topics')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.topics).toBeTruthy()
    expect(response.body.topics.length).toBe(3)
  })
})