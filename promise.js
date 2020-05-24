/** 
 *  PromiseA+ Spec 
 * 
 *  
 * 
 * */

const { PROMISE_STATUS } = require('./constants')
const { isPromise, isFunction, resolvePromise } = require('./utils')


function Promise(executor) {

    this.status = PROMISE_STATUS.PENDING
    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []

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
        this.status = PROMISE_STATUS.FULFILLED

        // execute rejected callbacks in loop.
        this.rejectedCallbacks.forEach(rejectedCallback => rejectedCallback(this.reason))
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------------

Promise.prototype.isPending = function () {
    return this.status === PROMISE_STATUS.PENDING
}

Promise.prototype.warehousing = function (stack, callback) {
    if (stack.indexOf(callback) === -1) {
        stack.push(callback)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : data => data
    onRejected = isFunction(onRejected) ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve, reject) => {
        switch (this.status) {
            case PROMISE_STATUS.FULFILLED:
                setTimeout(() => {
                    resolvePromise(promise2, onFulfilled(this.value), resolve, reject, this.value)
                }, 0)
                break;
            case PROMISE_STATUS.REJECTED:
                onRejected(this.reason)
                break;
            case PROMISE_STATUS.PENDING:
                this.warehousing(this.rejectedCallbacks, onRejected)
                this.warehousing(this.fulfilledCallbacks, () => resolvePromise(promise2, onFulfilled(this.value), resolve, reject, this.value))
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

Promise.all = function (...promises) {
    let results;
    let fulfilledCount = 0

    promises = promises.filter(promise => isPromise(promise))
    results = new Array(promises.length)

    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(
                value => {
                    results[index] = value

                    if (++fulfilledCount === promises.length) resolve(results)
                },
                err => reject(err))

        })
    })
}

Promise.race = function (...promises) {
    promises = promises.filter(promise => isPromise(promise))

    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            promise.then(value => resolve(value), err => reject(err))
        })
    })
}

module.exports = Promise