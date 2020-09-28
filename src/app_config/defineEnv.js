module.exports = function () {
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
    }
    process.on('uncaughtException', (ex) => {
        console.log("----------------->UncaughtException ", ex)
        process.exit(1)
    })
    process.on('unhandledRejection', (ex) => {
        console.log('------------------>unhandledRejection', ex)
        process.exit(1)
    })
}