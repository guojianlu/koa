class Router {
  constructor() {
    this.stack = []
  }
  register(path, methods, middleware) {
    const route = { path, methods, middleware }
    this.stack.push(route)
  }
  get(path, middleware) {
    this.register(path, 'get', middleware)
  }
  post(path, middleware) {
    this.register(path, 'post', middleware)
  }
  routes() {
    const stack = this.stack
    return async function(ctx, next) {
      const currentPath = ctx.url
      let route
      for(let i = 0, len = stack.length; i < len; i++) {
        const item = stack[i]
        if (currentPath === item.path && item.methods.indexOf(ctx.method) >= 0) {
          route = item.middleware
          break
        }
      }

      if (typeof route === 'function') {
        route(ctx, next)
        return
      }

      await next()
    }
  }
}

module.exports = Router
