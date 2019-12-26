module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.app.emit('error', err)
    ctx.body = 'server error'
    ctx.status = err.status || 500;
  }
}
