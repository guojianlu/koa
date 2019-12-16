// const add = (x, y) => x + y

// const square = z => z * z

// const compose = (...[first, ...other]) => (...args) => {
//   let ret = first(...args)
//   other.forEach(fn => {
//     ret = fn(ret)
//   })

//   return ret
// }

// const fn = compose(add, square, square)
// console.log(fn(1, 2))

function compose(middlewares) {
  return function(ctx) {
    return dispatch(0)

    function dispatch(i) {
      let fn = middlewares[i]

      if (!fn) {
        return Promise.resolve()
      }

      return Promise.resolve(fn(ctx, function next() {
        return dispatch(i + 1)
      }))
    }
  }
}


