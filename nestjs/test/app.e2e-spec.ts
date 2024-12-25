import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('E2E demo', () => {
  let app: INestApplication
  jest.setTimeout(30000) // Set timeout to 30 seconds
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

    it('/ (GET)', () => {
      request(app.getHttpServer()).get('/').expect(200).expect('hello')
    })

    it('/ ADMIN USER LOGIN (POST)', async () => {
      const adminAccount = 'admin@gmail.com'
      const adminPassword = 'Password1'
      const timeThreshold = 10000 // 10 seconds for admin login api
      const start = Date.now()
      const response = await request(app.getHttpServer())
        .post('/auth/admin/login')
        .send({ emailOrUserId: adminAccount, password: adminPassword })
      const end = Date.now()
      const duration = end - start   
      const expectedUser ={
        id: 1,
        email: 'admin@gmail.com',
        userId: 'admin'
      }
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id', expectedUser.id)
      expect(response.body.user).toHaveProperty('email', expectedUser.email)
      expect(response.body.user).toHaveProperty('userId', expectedUser.userId)
      expect(duration).toBeLessThanOrEqual(timeThreshold)
      return
    })

  afterAll(async () => {
    await app.close()
  })

})
