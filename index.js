const path = require('path')
const fs = require('fs')
const express = require('express')

const routerSysMon = require('./api/sysmon')
const routerSysServ = require('./api/sysserv')

const app = express()
const port = 3001

const sysmonFetcher = require('./sysmon-fetcher')
const registerCronJobs = require('./registerCronJobs')
const dbName = path.resolve(__dirname, 'sysmon.db')

// set up database (create if necessary and get data once)
let cronJobs = {}
sysmonFetcher.getCurrentUuids().then(uuids => {
    sysmonFetcher.initialise(dbName, uuids).then(() => {
        sysmonFetcher.newData(dbName, 'all', uuids)
    })

    // set up regular data updates
    cronJobs = registerCronJobs(dbName, uuids)
})

// set CORS header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', (req, res) => res.send('A wild API appeared!'))

// set main routes
app.use('/api/sysmon', routerSysMon)
app.use('/api/sysserv', routerSysServ)

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Oops, that went wrong!')
})
app.use(function (req, res, next) {
    res.status(404).send('No can do, nothing found here!')
})

// serve static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// start server
const server = app.listen(port, () => console.log(`Express app now listening on port ${port}!`))

// close server and wait for any cron jobs when shutting down
const gracefulShutdown = () => {
    console.log('Shutting down...')
    server.close(() => {
        console.log('Express app closed.')

        while (!(cronJobs.daily.getStatus() === 'scheduled' && 
                cronJobs.hourly.getStatus() === 'scheduled' && 
                cronJobs.halfMinutely.getStatus() === 'scheduled')) {}

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
