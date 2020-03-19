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
        removable: false,
        partitionLabels: ['Part1', 'Part2', 'Part3'],
        partitions: [264697825962, 264697825962, 264125442752]
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
        removable: false,
        partitionLabels: ['Partition'],
        partitions: [499977781248]
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
        removable: false,
        partitionLabels: ['Data', 'Stuff'],
        partitions: [499977781248, 1000191556266]
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
        removable: true,
        partitionLabels: ['Part'],
        partitions: [15916335104]
    }
]))

app.get('/api/fsHist', (req, res) => res.send([
    {
        uuid: 'eluwgg-398z93',
        timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        used: [180823112487, 571856243995, 877133753355, 898486387102, 180823112487, 571856243995, 877133753355, 898486387102, 877133753355],
        smart: ['Ok', 'Ok', 'Ok', 'Ok', 'Ok', 'Ok', 'Ok', 'Ok', 'Ok'],
        rx: [20, 30, 40, 20, 40, 30, 20, 40, 0],
        tx: [10, 20, 40, 45, 11, 12, 20, 49, 20]
    },
    {
        uuid: 'uibiu-39aasdz93',
        timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        used: [571856243995, 898486387102, 180823112487, 571856243995, 180823112487, 180823112487, 180823112487, 898486387102, 898486387102],
        smart: ['Ok', 'Ok', 'Ok', 'Ok', 'Predicted Failure', 'Predicted Failure', 'Predicted Failure', 'Predicted Failure', 'Predicted Failure'],
        rx: [49, 10, 20, 30, 20, 10, 0, 20, 10],
        tx: [33, 25, 43, 20, 30, 40, 20, 22, 10]
    },
    {
        uuid: '6357s-398z93',
        timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        used: [571856243995, 571856243995, 180823112487, 571856243995, 571856243995, 180823112487, 571856243995, 571856243995, 571856243995],
        smart: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'],
        rx: [10, 20, 40, 45, 11, 12, 20, 49, 20],
        tx: [20, 30, 40, 20, 40, 30, 20, 40, 0]
    },
    {
        uuid: 'fubwligo8aasd',
        timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        used: [571856243995, 898486387102, 180823112487, 571856243995, 180823112487, 180823112487, 180823112487, 898486387102, 898486387102],
        smart: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown', 'unknown'],
        rx: [33, 25, 43, 20, 30, 40, 20, 22, 10],
        tx: [49, 10, 20, 30, 20, 10, 0, 20, 10]
    }
]))

app.get('/api/userInfo', (req, res) => res.send([
    {
        num: 1,
        user: 'pi',
        terminal: 'ttyBla',
        loginDate: '07.03.20',
        loginTime: '13:00',
        ip: '192.168.100.100',
        lastCmd: 'htop'
    },
    {
        num: 2,
        user: 'raspi',
        terminal: 'ttyBlub',
        loginDate: '10.03.80',
        loginTime: '17:00',
        ip: '192.168.6.30',
        lastCmd: 'nope'
    }
]))

app.get('/api/userHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    users: {
        pi: [1, 3, 2, 5, 1, 1, 9, 0, 1],
        raspi: [0, 6, 2, 3, 4, 0, 3, 2, 2]
    }
}))

app.get('/api/netInfo', (req, res) => res.send([
    {
        num: 1,
        iface: 'eth0',
        ip: '192.168.100.100',
        mac: '00ebfedasvdewieuvfavea',
        type: 'wired',
        speed: '1000',
        dhcp: 'true',
        rx: 203754,
        tx: 295352
    },
    {
        num: 2,
        iface: 'eth1',
        ip: '192.168.52.40',
        mac: '0998gqaw98gf8o47v',
        type: 'wireless',
        speed: '100',
        dhcp: 'false',
        rx: 27833,
        tx: 69829
    }
]))

app.get('/api/netHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    rx: [10, 32, 26, 54, 19, 18, 92, 4, 21],
    tx: [25, 32, 26, 54, 33, 39, 29, 42, 44]
}))

app.get('/api/cpuInfo', (req, res) => res.send({
    curCpuLoad: 23,
    curCpuTemp: 40
}))

app.get('/api/cpuHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    usage: [10, 32, 26, 54, 19, 18, 92, 4, 21],
    temperature: [25, 32, 26, 54, 33, 39, 29, 42, 44]
}))

app.get('/api/memInfo', (req, res) => res.send({
    curMemUsed: 20,
    curMemBuffered: 10,
    curMemCached: 38
}))

app.get('/api/memHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    used: [25, 32, 26, 54, 33, 39, 29, 42, 44],
    buffered: [10, 12, 16, 20, 10, 12, 10, 20, 30],
    cached: [15, 6, 25, 2, 10, 4, 0, 13, 5],
    swap: [0, 1, 0, 5, 4, 0, 0, 2, 10]
}))

app.get('/api/testData', (req, res) => res.send({
    a: 'sdelfbsef',
    b: '2372385',
    c: 'afugilef',
    d: '948532',
    e: 'wlfuabdlfia',
    f: '49853645',
    g: 'afuvaidf',
    h: '39485z3',
    i: 'SDSBDAFBAbvO',
    j: '75t25'
}))

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
