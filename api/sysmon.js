const path = require('path')
const express = require('express')
const routerSysMon = express.Router()

const DAO = require('../DBmngr/dao')
const SQLiteReader = require('../DBmngr/sqliteReader')
const dbRef = require('../sysmon-fetcher/initDb')
const sleep = require('../sysmon-fetcher').sleep
const dbName = path.resolve(path.join(__dirname, '../'), 'sysmon.db')

let dao = null
let reader = null

// wait some time in case the database is being newly created
sleep(2000).then(() => {
    dao = new DAO(dbName, 'RO')
    reader = new SQLiteReader(dao)
})

function sortedIndexToInsert(compareArray, insertValue) {
    let low = 0
    let high = compareArray.length

    while (low < high) {
        let mid = (low + high) >>> 1
        if (compareArray[mid] < insertValue) {
            low = mid + 1
        }
        else {
            high = mid
        }
    }
    return low
}

routerSysMon.use((req, res, next) => {
    console.log('sysmon router hit for: %s', req.originalUrl)
    next()
})

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
    reader.readAllRows(
        dbRef.tableUserInfo,
        dbRef.getColsUserInfo().names,
        {
            orderBy: 'timestamp',
            orderOrientation: 'DESC'
        }
    ).then(data => {
        // only send most recent info
        res.send(data.filter(obj => obj.timestamp === data[0].timestamp))
    }).catch(next)
})

routerSysMon.get('/userHist', (req, res, next) => {
    reader.readAllRows(dbRef.tableUserInfo, dbRef.getColsUserInfo().names).then(data => {
        let loginTimestamps = []
        let users = {}

        let tempUsers = []
        data.forEach(element => {
            tempUsers.push(element.user)
        })
        
        tempUsers = tempUsers.filter((item, index) => tempUsers.indexOf(item) === index)
        tempUsers.forEach(user => {
            let userData = data.filter(obj => obj.user === user)
            let userDates = []
            userData.forEach(element => {
                userDates.push(element.loginDate)
            })

            // generate object with counted loginDates
            const map = userDates.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
            const countedDates = Object.assign(...[...map.entries()].map(([k, v]) => ({ [k]: v })))

            const orderedCountedDates = {}
            Object.keys(countedDates).sort().forEach(key => {
                orderedCountedDates[key] = countedDates[key]
            })

            users[user] = []

            Object.keys(orderedCountedDates).forEach(date => {
                let timestamp = new Date(date).getTime()
                if (!loginTimestamps.includes(timestamp)) {
                    let index = sortedIndexToInsert(loginTimestamps, timestamp)
                    loginTimestamps.splice(index, 0, timestamp)

                    // add new timestamp index to all users
                    Object.keys(users).forEach(key => {
                        // if user does not have enough elements to satisfy the needed index, fill with zeros
                        if (users[key].length < index) {
                            users[key].push(...Array.from(Array(index + 1), () => 0))
                        }
                        users[key].splice(index, 0, 0)

                        if (key === user && orderedCountedDates[date] >= 0) {
                            users[key][index] = orderedCountedDates[date]
                        }
                    })
                }
                else {
                    let index = loginTimestamps.indexOf(timestamp)
                    users[user][index] = orderedCountedDates[date]
                }
            })
        })

        res.send({
            timestamps: loginTimestamps,
            users: users
        })
    }).catch(next)
})

routerSysMon.get('/netInfo', (req, res, next) => {
    reader.readAllRows(
        dbRef.tableNetInfo,
        dbRef.getColsNetInfo().names,
        {
            orderBy: 'timestamp',
            orderOrientation: 'DESC'
        }
    ).then(data => {
        // only send most recent info
        res.send(data.filter(obj => obj.timestamp === data[0].timestamp))
    }).catch(next)
})

routerSysMon.get('/netHist', (req, res, next) => {
    reader.readAllRows(dbRef.tableNetInfo, dbRef.getColsNetInfo().names).then(data => {
        let timestamps = []
        let rx = {}
        let tx = {}

        let tempIfaces = []
        data.forEach(element => {
            timestamps.push(element.timestamp)
            tempIfaces.push(element.iface)
        })
        timestamps = timestamps.filter((item, index) => timestamps.indexOf(item) === index)

        tempIfaces = tempIfaces.filter((item, index) => tempIfaces.indexOf(item) === index)
        tempIfaces.forEach(iface => {
            rx[iface] = []
            tx[iface] = []
            timestamps.forEach(timestamp => {
                rx[iface].push(data.filter(obj => obj.timestamp === timestamp && obj.iface === iface)[0].rx)
                tx[iface].push(data.filter(obj => obj.timestamp === timestamp && obj.iface === iface)[0].tx)
            })
        })

        res.send({
            timestamps: timestamps,
            rx: rx,
            tx: tx
        })
    }).catch(next)
})

routerSysMon.get('/cpuInfo', (req, res, next) => {
    let intermedResult = {}
    reader.readAllRows(
        dbRef.tableCpuInfo,
        dbRef.getColsCpuInfo().names,
        {
            orderBy: 'timestamp',
            orderOrientation: 'DESC'
        }
    ).then(data => {
        intermedResult.cpu = data
        return reader.readAllRows(
            dbRef.tableCpuTemp,
            dbRef.getColsCpuTemp().names,
            {
                orderBy: 'timestamp',
                orderOrientation: 'DESC'
            }
        )
    }).then(data => {
        // only send most recent info
        res.send({
            timestamp: data[0].timestamp,
            curCpuLoad: intermedResult.cpu[0].cpuLoad,
            curCpuTemp: data[0].temperature
        })
    }).catch(next)
})

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
