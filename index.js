const Koa = require('./src/koa')
const app = new Koa()

// 数据缓存
const cache = require('./src/cache')
app.use(cache('/api/data'))

// 请求拦截
app.use(require('./src/interceptor'))

// 静态文件服务
const static = require('./src/static')
app.use(static(__dirname + '/public'))

// 路由中间件
const Router = require('./src/router')
const router = new Router()

router.get('/index', async ctx => { ctx.body = 'index page' })
router.get('/post', async ctx => { ctx.body = 'post page' })
router.get('/list', async ctx => { ctx.body = 'list page' })
router.post('/index', async ctx => { ctx.body = 'index page' })

app.use(router.routes())

app.listen(3000, () => {
  console.log(`server is running at 3000 port`)
})

