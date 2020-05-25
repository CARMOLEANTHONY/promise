/** 
 *  Create a Promise class which should follow PromiseA+ Spec. 
 *  Note: this script only could be executed in Node ENV since we was using require here.
 *        You can compile this to ES5 by babel in your app, or declare those variables in this file instead of using require.
 * 
 *  @author Carmelo
 *  @date 2020/5/25 CST
 * 
 * */

const { PROMISE_STATUS } = require('./constants')
const { isArray, isPromise, isFunction, resolvePromise } = require('./utils')


function Promise(executor) {

    this.status = PROMISE_STATUS.PENDING
    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []

    //  Using TryCatch to Capture error and then handle it by reject if has.
    try {
        executor(resolve.bind(this), reject.bind(this))
    } catch (err) {
        reject(err)
    }

    // -----------------------------------------------------------------------------------

    function resolve(value) {
        // In case VALUE is an instance of Promise as well.
        if (value instanceof Promise) return value.then(resolve, reject)

        if (this.status !== PROMISE_STATUS.PENDING) return

        this.value = value
        this.status = PROMISE_STATUS.FULFILLED

        // execute fulfilled callbacks in loop.
        this.fulfilledCallbacks.forEach(fulfilledCallback => fulfilledCallback(this.value))
    }

    function reject(reason) {
        if (this.status !== PROMISE_STATUS.PENDING) return

        this.reason = reason
        this.status = PROMISE_STATUS.REJECTED

        // execute rejected callbacks in loop.
        this.rejectedCallbacks.forEach(rejectedCallback => rejectedCallback(this.reason))
    }
}

// ---------------------------------------------------------------------------------------------

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : data => data
    onRejected = isFunction(onRejected) ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve, reject) => {
        switch (this.status) {
            case PROMISE_STATUS.FULFILLED:
                setTimeout(() => {
                    resolvePromise(promise2, onFulfilled(this.value), resolve, reject)
                }, 0)

                break
            case PROMISE_STATUS.REJECTED:
                try {
                    onRejected(this.reason)
                } catch (err) {
                    reject(err)
                }

                break
            case PROMISE_STATUS.PENDING:
                this.rejectedCallbacks.push((reason) => {
                    onRejected(reason)
                    resolve()
                })

                this.fulfilledCallbacks.push((value) => resolvePromise(promise2, onFulfilled(value), resolve, reject))
        }
    })

    return promise2
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

Promise.prototype.finally = function (callback) {
    return this.then(
        value => Promise.resolve(callback()).then(() => value),
        err => Promise.resolve(callback()).then(() => { throw err })
    )
}

// ----------------------------------------------------------------------------------------------------------------------------------------

Promise.resolve = function (value) {
    return new Promise(resolve => resolve(value))
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => reject(reason))
}

Promise.all = function (promises) {
    promises = isArray(promises) ? promises : []

    let fulfilledCount = 0
    let promisesLength = promises.length
    let results = new Array(promisesLength)

    return new Promise((resolve, reject) => {
        if (promisesLength === 0) return resolve([])

        promises.forEach((promise, index) => {
            if (isPromise(promise)) {
                promise.then(
                    value => {
                        results[index] = value

                        if (++fulfilledCount === promisesLength) resolve(results)
                    },
                    err => reject(err)
                )
            } else {
                results[index] = promise

                if (++fulfilledCount === promisesLength) resolve(results)
            }

        })
    })
}

Promise.race = function (promises) {
    promises = isArray(promises) ? promises.filter(isPromise) : []

    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            promise.then(value => resolve(value), err => reject(err))
        })
    })
}

Promise.defer = Promise.deferred = function () {
    let dfd = {}

    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })

    return dfd
}

module.exports = Promise