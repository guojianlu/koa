module.exports = async (ctx, next) => {
  const { req } = ctx.request
  const reqDate = []
  let size = 0

  await new Promise((resolve, reject) => {
    req.on('data', data => {
      reqDate.push(data)
      size += data.length
    })

    req.on('end', () => {
      const data = Buffer.concat(reqData, size)
      ctx.request.body = data.toString()
      resolve()
    })
  })
  await next()
}
