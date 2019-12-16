// 请求拦截中间件：黑名单中存在的ip访问将被拒绝

module.exports = async function(ctx, next) {
  const { res, req } = ctx
  const blackList = ['192.145.23.22']
  const ip = getClientIP(req)
  if (blackList.includes(ip)) { //出现在黑名单中将被拒绝
    ctx.body = "not allowed"
  } else {
    await next();
  }
}

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"] || // 判断是否有反向代理 IP 
    req.connection.remoteAddress || // 判断 connection 的远程 IP 
    req.socket.remoteAddress || // 判断后端的 socket 的 IP 
    req.connection.socket.remoteAddress
  )
}
