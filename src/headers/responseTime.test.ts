import { beforeEach, describe, test } from '@jest/globals'
import Koa from 'koa'
import request from 'supertest'
import { responseTime } from './reponseTime'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

describe('response time header', () => {
  let app: any

  beforeEach(async () => {
    app = new Koa()

    app.use(responseTime())
  })

  describe('no passing', () => {
    test('should return 404', async () => {
      await request(app.listen())
        .get('/')
        .expect('X-Response-Time', /ms$/)
        .expect(404)
    })
  })

  describe('passing', () => {
    test('should set header X-reponse-Time', async () => {
      app.use(async (ctx: { body: string }) => {
        ctx.body = 'sample'
      })

      await request(app.listen())
        .get('/')
        .expect('X-Response-Time', /ms$/)
        .expect(200)
    })

    test('should set header X-reponse-Time', async () => {
      app.use(async (ctx: { body: string }) => {
        await sleep(500)
        ctx.body = 'sample'
      })

      await request(app.listen())
        .get('/')
        .expect('X-Response-Time', /^50/)
        .expect(200)
    })
  })
})
