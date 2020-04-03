const path = require('path')
const express = require('express')
const routerSysMon = express.Router()

const DAO = require('../db/dao')
const SQLiteReader = require('../db/getData')
const dbRef = require('../sysmon-fetcher/initDb')
const dbName = path.resolve(path.join(__dirname, '../'), 'sysmon.db')

let dao = new DAO(dbName)
let reader = new SQLiteReader(dao)

routerSysMon.use((req, res, next) => {
    console.log('sysmon router hit for: %s', req.originalUrl)
    next()
})

routerSysMon.get('/test', (req, res) => res.send('Test message'))

routerSysMon.get('/devInfo', (req, res, next) => {
    reader.readAllRows(dbRef.tableDevInfo, dbRef.getColsDevInfo().names).then(data => {
        res.send(data[0])
    }).catch(next)
})

routerSysMon.get('/fsInfo', (req, res) => res.send([
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

routerSysMon.get('/fsHist', (req, res) => res.send([
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

routerSysMon.get('/userInfo', (req, res, next) => {
    reader.readAllRows(dbRef.tableUserInfo, dbRef.getColsUserInfo().names).then(data => {
        res.send(data)
    }).catch(next)
})

routerSysMon.get('/userHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    users: {
        pi: [1, 3, 2, 5, 1, 1, 9, 0, 1],
        raspi: [0, 6, 2, 3, 4, 0, 3, 2, 2]
    }
}))

routerSysMon.get('/netInfo', (req, res) => res.send([
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

routerSysMon.get('/netHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    rx: [10, 32, 26, 54, 19, 18, 92, 4, 21],
    tx: [25, 32, 26, 54, 33, 39, 29, 42, 44]
}))

routerSysMon.get('/cpuInfo', (req, res) => res.send({
    curCpuLoad: 23,
    curCpuTemp: 40
}))

routerSysMon.get('/cpuHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    usage: [10, 32, 26, 54, 19, 18, 92, 4, 21],
    temperature: [25, 32, 26, 54, 33, 39, 29, 42, 44]
}))

routerSysMon.get('/memInfo', (req, res) => res.send({
    curMemUsed: 20,
    curMemBuffered: 10,
    curMemCached: 38
}))

routerSysMon.get('/memHist', (req, res) => res.send({
    timestamps: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    used: [25, 32, 26, 54, 33, 39, 29, 42, 44],
    buffered: [10, 12, 16, 20, 10, 12, 10, 20, 30],
    cached: [15, 6, 25, 2, 10, 4, 0, 13, 5],
    swap: [0, 1, 0, 5, 4, 0, 0, 2, 10]
}))

module.exports = routerSysMon
