// 数据缓存中间件
let cache = {}

module.exports = (path = '/api/data') => {
  return async (ctx, next) => {
    if (ctx.url.startsWith(path)) {
      const key = ctx.url
      const start = (new Date).getTime()
      let result, end, statusCode = 200, isCache = false
      if (cache[key]) {
        result = cache[key]
        isCache = true
      } else {
        try {
          result = await fetchData(key)
          cache[key] = result
        } catch (error) {
          statusCode = 500
          console.log(error)
        }
      }
      ctx.body = result
      end = (new Date).getTime()
      console.log(`${ctx.req.method} ${ctx.url} ${statusCode} ${parseInt(end - start)}ms ${!isCache ? '请求' : '缓存'}`)
    } else {
      await next()
    }
  }
}

function fetchData(key) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(key)
    }, 200 + Math.floor(Math.random() * 10));
  })
}

setInterval(function(){
  const hours = new Date().getHours()
  const min = new Date().getMinutes()
  const sec = new Date().getSeconds()
  if(hours=='0' && min=='0' && sec=='0'){
    // 指定每天凌晨做的事情
    cache = {}
  }
}, 1000)


//test
const RANGELEN = 15

function mockRequest() {
  const base = 'http://127.0.0.1:3000/api/data'

  const { promisify } = require('util')

  const request = promisify(require('request'))
  const path = `${base}/${Math.floor(Math.random() * RANGELEN)}`

  return request(path)
}

let count = 0

let num = 2

let timer

const fn = () => {
  if (count < RANGELEN * num && num > 0) {
    mockRequest()
    count++
    timer  = setTimeout(fn, 250)
  } else {
    if (--num > 0) {
      console.log(`定时器清除缓存`)
      count = 0
      cache = {}
      timer  = setTimeout(fn, 250)
    } else {
      clearTimeout(timer)
    }
  }
}

timer = setTimeout(fn, 220);
