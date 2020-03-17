const path = require('path')
const fs = require('fs')
const express = require('express')

const app = express()
const port = 3000
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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/deviceInfo', (req, res) => res.send({
    manufacturer: 'RPi Foundation',
    model: 'Raspberry Pi 4 B',
    version: 'Rev 1.1',
    cpuManufacturer: 'ARM',
    cpuCores: '4',
    memory: '4 GB',
    osDistro: 'Linux Raspbian',
    osCode: 'buster',
    osHostname: 'raspi',
    uptime: '1d 16h'
}))

app.get('/api/fsInfo', (req, res) => res.send([
    {
        num: 1,
        name: '/dev/sda',
        fsType: 'vfat',
        label: 'Ext HDD',
        mount: '/home/pi/ext',
        size: 1000200990720,
        used: 794093477888,
        usedPercentage: 79.3933904540894,
        uuid: 'eluwgg-398z93',
        smart: 'Ok',
        vendor: 'TOSHIBA',
        modelName: 'External_USB_3.0',
        interface: 'USB',
        diskType: 'HD',
        removable: false
    },
    {
        num: 2,
        name: '/dev/sdb',
        fsType: 'ext4',
        label: 'HDD',
        mount: '/home/pi/hdd',
        size: 999955562496,
        used: 218658373632,
        usedPercentage: 21.8668090696155,
        uuid: 'uibiu-39aasdz93',
        smart: 'Predicted Failure',
        vendor: 'Seagate',
        modelName: 'ST1000DM003-1CH162',
        interface: 'USB',
        diskType: 'HD',
        removable: false
    },
    {
        num: 3,
        name: '/dev/sdc',
        fsType: 'ext4',
        label: 'HDD',
        mount: '/home/pi/hdd',
        size: 3000574668800,
        used: 1638683799552,
        usedPercentage: 54.6123319839712,
        uuid: '6357s-398z93',
        smart: 'unknown',
        vendor: 'Intenso',
        modelName: 'USB_3.0_Device',
        interface: 'USB',
        diskType: 'HD',
        removable: false
    },
    {
        num: 4,
        name: '/dev/sdd',
        fsType: 'ext4',
        label: 'Thumb Drive',
        mount: '/home/pi/usb',
        size: 15916335104,
        used: 10312435104,
        usedPercentage: 64.7915178752949,
        uuid: 'fubwligo8aasd',
        smart: 'unknown',
        vendor: 'General',
        modelName: 'USB_Flash_Disk',
        interface: 'USB',
        diskType: 'HD',
        removable: true
    }
]))

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
