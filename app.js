const path = require('path')
const fs = require('fs')
const express = require('express')

const routerSysMon = require('./api/sysmon')
const routerSysServ = require('./api/sysserv')
const routerTVspotter = require('./api/tvspotter')

const app = express()

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
    // TODO: uncomment this again, disabled just for tvspotter testing
    // cronJobs = registerCronJobs(dbName, uuids)
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
app.use('/api/tvspotter', routerTVspotter)

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

module.exports = {
    app: app,
    cronJobs: cronJobs
}
