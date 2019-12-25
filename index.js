// const Koa = require('./src/koa')
const Koa = require('koa')
const app = new Koa()

// 请求拦截
app.use(require('./src/middleware/interceptor'))

// 静态文件服务
const static = require('./src/middleware/static')
app.use(static(__dirname + '/public'))

// 路由中间件
// const Router = require('./src/middleware/router')
// const router = new Router()
const router = require('koa-router')()

router.get('/index', async ctx => { ctx.body = 'index page' })
router.get('/post', async ctx => { ctx.body = 'post page' })
router.get('/list', async ctx => { ctx.body = 'list page' })
router.post('/index', async ctx => { ctx.body = 'index page' })

// 数据缓存
const cache = require('./src/middleware/cache')
app.use(cache({
  // refresh: '0 0 0 * * ? *', // 每日0点执行
  refresh: '*/10 * * * * *', // 每十秒一次
  prefix: '/api/data',
  // urlPattern: /^\/api\/data\/\w+$/,
}))

const delay = (tick, data) => new Promise(resolve => {
  setTimeout(() => resolve(data), tick)
})
router.get('/api/data/:id', async (ctx, next) => {
  // 模拟延时数据
  ctx.body = await delay(200, { id: ctx.params.id })
})

app.use(router.routes())

router.get('/user', async (ctx, next) => {
  // 模拟延时数据
  console.log('user')
  ctx.body = 'user'
})


app.listen(3000, () => {
  console.log(`server is running at 3000 port`)
})


// 测试代码, 用于验证缓存中间件是否生效
// const http = require('http');
// setInterval(async () => {
//     const id = (Math.random() * 9).toFixed()
//     http.get(`http://localhost:3000/api/data/${id}`);
// }, 500)
