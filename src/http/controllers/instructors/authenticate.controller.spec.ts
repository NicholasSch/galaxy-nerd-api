import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import path from 'path'
import fs from 'fs'

const avatar = fs.readFileSync(
  path.resolve(__dirname, '..', 'tests', 'assets', 'avatar.png'),
)

describe('Authenticate Instructor Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 when instructor is authenticated', async () => {
    await request(app.server)
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

    const response = await request(app.server)
      .post('/instructors/sessions')
      .send({
        email: 'johndoe@gmail.com',
        password: '@17Edilson17',
      })

    expect(response.statusCode).toBe(200)
  })
})