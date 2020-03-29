const path = require('path')
const fs = require('fs')
const express = require('express')

const routerSysMon = require('./api/sysmon')
const routerSysServ = require('./api/sysserv')

const app = express()
const port = 3001


/*
let database = require('./db.js')
let saveToDb = require('./saveToDb.js')
let dbName = 'main.db'
*/
/*if (!fs.existsSync(dbName)) {
    database.initDbWithBaseTables(dbName)
    setTimeout(function () {
        // set static data
        saveToDb.newDataSysInfo(dbName)
        // initialise first data point for other data
        saveToDb.newDataSysMonHist(dbName)
        saveToDb.newDataUsersHist(dbName)
        saveToDb.newDataFsHist(dbName)
        //saveToDb.newDataFsIoHist(dbName)
        saveToDb.newDataNetHist(dbName)
        saveToDb.newDataDockerInfoHist(dbName)
    }, 2500)
}
*/

// set CORS header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', (req, res) => res.send('Hello World!'))

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
app.listen(port, () => console.log(`Express app now listening on port ${port}!`))
