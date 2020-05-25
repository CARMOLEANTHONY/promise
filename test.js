const Promise = require('./promise')

const myPromise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success1!!!')
    }, 2000)
})

const myPromise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success2!!!')
    }, 3000)
})


Promise.all([myPromise1, myPromise2, 123]).then(res => {
    console.log(res, 'all') // ['success1!!!', 'success2!!!']
}, err => {
    console.log(err)
})

Promise.race([myPromise1, myPromise2]).then(res => {
    console.log(res, 'race') // success1!!!
})

// catch test
const myPromise3 = new Promise((resolve, reject) => {
    reject(new Error('error occurred'))
})

myPromise3.catch(err => {
    console.log(err) // error occurred
})

// then test
const myPromise4 = new Promise((resolve, reject) => {
    resolve(1)
})

myPromise4.then(res => {
    console.log(res) // 1
}).then().then().then(res => {
    console.log(res, 'res') // 1
})

myPromise4.then(res => {
    console.log(res) // 1
    return new Promise(resolve => resolve(2))
}).then(res => {
    console.log(res, 'res') // 2
})

myPromise4.then()
    .finally(() => console.log('finally'))
    .then(res => console.log(res)) // 1
