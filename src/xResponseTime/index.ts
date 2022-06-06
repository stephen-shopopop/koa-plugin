import type { Context, Next } from 'koa'

/**
 *
 * @returns
 *
 * ```ts
 * inport Koa from 'koa'
 * import { responseTime } from '@stephen-shopopop/koa-plugin'
 *
 * const app = new Koa()
 * app.use(responseTime())
 * ```
 */
export function responseTime (options = undefined): Function {
  return async function responseTime (ctx: Context, next: Next) {
    const start = process.hrtime()

    return await next().then((): void => {
      const delta = process.hrtime(start)
      const reponseTime = Math.round(delta[0] * 1000 + delta[1] / 1000000)

      ctx.set('X-Response-Time', `${reponseTime} ms`)
    })
  }
}
