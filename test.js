const Promise = require('./promise')

const myPromise = new Promise((resolve, reject) => {
    console.log('111')
    setTimeout(() => {
        resolve('success!!!')
        
        // reject('出错了！')
    }, 2000)
})

myPromise.then(value => {
    console.log('value1', value)
}, reason => {
    console.log('reason1', reason)
})


myPromise.then(value => {
    console.log('value2', value)
}, reason => {
    console.log('reason2', reason)
})
