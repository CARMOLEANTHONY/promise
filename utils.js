const isArray = validateType('Array')
const isObject = validateType('Object')
const isFunction = validateType('Function')

function validateType(type) {
    return function (source) {
        return Object.prototype.toString.call(source) === `[object ${type}]`
    }
}

function isPromise(source) {
    return source && isObject(source) && isFunction(source.then)
}

function resolvePromise(promise, x, resolve, reject, value) {
    // Can not wait itself.
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    // Aviod calling repeatedly.
    let called = false

    if (x !== null && (isObject(x) || isFunction(x))) {
        try {
            let then = x.then

            if (isFunction(then)) {
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
                    }
                )
            } else {
                resolve(x)
            }
        } catch (err) {
            if (called) return
            called = true

            reject(err)
        }
    } else {
        resolve(x)
    }
}



module.exports = {
    isArray,
    isObject,
    isPromise,
    isFunction,
    resolvePromise
}