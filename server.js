const { app, cronJobs } = require('./app')

const port = 3001

// start server
const server = app.listen(port, () => console.log(`Express app now listening on port ${port}!`))

// close server and wait for any cron jobs when shutting down
const gracefulShutdown = () => {
    console.log('Shutting down...')
    server.close(() => {
        console.log('Express app closed.')

        while (!(cronJobs.daily.getStatus() === 'scheduled' && 
                cronJobs.hourly.getStatus() === 'scheduled' && 
                cronJobs.minutely.getStatus() === 'scheduled')) {}

        console.log('No cron job currently running, exiting..')
        process.exit(0)
    })
}

process.on('SIGTERM', () => {
    console.log('\n')
    console.log('SIGTERM received.')
    gracefulShutdown()
})

process.on('SIGINT', () => {
    console.log('\n')
    console.log('SIGINT received.')
    gracefulShutdown()
})