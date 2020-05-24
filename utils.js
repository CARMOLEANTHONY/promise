const isObject = source => Object.prototype.toString.call(source) === '[object Object]'
const isFunction = source => Object.prototype.toString.call(source) === '[object Function]'
const isPromise = source => source && isObject(source) && isFunction(source.then)

const resolvePromise = (promise, x, resolve, reject, value) => {
    // 不能等待自己完成
    if (promise === x) {
        return reject(new TypeError('Chaining cycle in promise'))
    }

    // 避免重复调用
    let called = false

    if (x === undefined) return resolve(value) // 如果onFilfilled()没有return任何东西，resolve上一个promise的value

    if (!isPromise(x)) return resolve(x) // 如果onFilfilled()返回的是一个合法的普通js值直接resolve

    // 如果如果onFilfilled()返回的是另一个promise，递归执行直至它是一个合法的普通js值
    try {
        const { then } = x

        then.call(
            x,
            y => {
                if (called) return
                called = true

                resolvePromise(promise, y, resolve, reject)
            },
            r => {
                if (called) return
                called = true

                reject(r)
            })
    } catch (err) {
        if (called) return
        called = true

        reject(err)
    }
}


module.exports = {
    isObject,
    isPromise,
    isFunction,
    resolvePromise
}