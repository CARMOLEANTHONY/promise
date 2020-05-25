const isArray = validateType('Array')
const isObject = validateType('Object')
const isFunction = validateType('Function')

function validateType(type){
    return function(source){
        return Object.prototype.toString.call(source) === `[object ${type}]`
    }
}

function isPromise(source) {
    return source && isObject(source) && isFunction(source.then)
}

function warehousing (stack, callback) {
    if (stack.indexOf(callback) === -1) stack.push(callback)
}

function resolvePromise(promise, x, resolve, reject, value) {
    // Can not wait itself.
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    // Aviod calling repeatedly.
    let called = false

    if (x === undefined) return resolve(value) // Resolve previous value if x is undefined.

    if (!isPromise(x)) return resolve(x) // Resolve x if x is not a promise(which means x is a legal JS variable like boolean/number/string/object...)

    // If x is a promise, we recursively call the resolvePromise until it becomes to a legal JS value.
    try {
        const { then } = x

        then.call(
            x,
            y => {
                if (called) return
                called = true

                resolvePromise(promise, y, resolve, reject, value)
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
    isArray,
    isObject,
    isPromise,
    isFunction,
    warehousing,
    resolvePromise
}