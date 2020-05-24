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

const myPromise3 = new Promise((resolve, reject) => {
    reject('err')
})

Promise.all(myPromise1, myPromise2).then(res => {
    console.log(res)
})

Promise.race(myPromise1, myPromise2).then(res => {
    console.log(res)
})

myPromise3.then( res => {
    console.log('res', res)
}, err => {
    console.log(err)
})


myPromise3.catch( err => {
    console.log(err)
})
