const schedule = require('node-schedule')

module.exports = (
  config = {
    refresh: '0 0 0 * * ? *', // 每日0点执行
    // refresh: '*/1 * * * * *', // 每秒一次
    urlPattern: /^\/api\/data\/\w+$/,
  }
) => {
  let cacheStore = {}

  // 定时任务
  schedule.scheduleJob(config.refresh, () => {
    // 清理缓存数据
    cacheStore = {}
  })

  return async (ctx, next) => {
    const start = new Date()
    const { url, method } = ctx

    const isNeedCache = method === 'GET' && (
      (config.prefix !== '' && url.indexOf(config.prefix) === 0) ||
      (config.pattern && config.pattern.test(url))
    )

    if (isNeedCache) {
      const cache = cacheStore[url]
      
      if (cache) {
        ctx.body = cache

        const duration = new Date() - start;
        console.log(ctx.method + ' ' + ctx.path + ' ' + ctx.status + ' ' + duration +  'ms' + ' 缓存');
        
        return
      }

      await next()

      cacheStore[url] = ctx.body
    }

    const duration = new Date() - start
    console.log(ctx.method + ' ' + ctx.path + ' ' + ctx.status + ' ' + duration + 'ms' + ' 请求')

    await next()
  }
}
