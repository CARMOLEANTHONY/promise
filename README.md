# promise
create a promise class which follows PromiseA+

### Note
this script only could be executed in Node ENV since we was using require here. You can compile this to ES5 by babel in your app, or declare those variables in this file instead of using require.

### Test
we can test whether our implementation follows PromiseA+ by  [promises-aplus-tests](https://www.npmjs.com/package/promises-aplus-tests).

    #### Setup

        * Install promises-aplus-tests globally.
         `npm i promises-aplus-tests -g`

        * Start testing.
         `promises-aplus-tests promise.js`

    Then test cases will be executed on command line.
