/** 
 *  PromiseA+ Spec 
 * 
 *  
 * 
 * */

const { PROMISE_STATUS } = require('./constants')
const { all, race, resolve } = require('./promise-static')



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

Promise.prototype.isPending = function () {
    return this.status === PROMISE_STATUS.PENDING
}

Promise.prototype.warehousing = function (stack, callback) {
    if (stack.indexOf(callback) === -1) {
        stack.push(callback)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    if (!this.isPending()) return

    this.warehousing(this.fulfilledCallbacks, onFulfilled)
    this.warehousing(this.rejectedCallbacks, onRejected)

    return new Promise(resolve => resolve(this.value))
}

Promise.prototype.catch = function (onRejected) {
    if (!this.isPending()) return

    this.warehousing(this.rejectedCallbacks, onRejected)
}

Promise.prototype.finally = function () {

}

module.exports = Promise