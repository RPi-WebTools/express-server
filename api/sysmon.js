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

routerSysMon.get('/fsInfo', (req, res, next) => {
    reader.readAllRows(
        dbRef.tableFsInfo,
        dbRef.getColsFsInfo().names,
        {
            orderBy: 'timestamp',
            orderOrientation: 'DESC'
        }
    ).then(data => {
        let result = []

        let lastTimestamp = data[0].timestamp
        let filtered = data.filter(obj => obj.timestamp === lastTimestamp)

        filtered.forEach((element, index, array) => {
            result.push({
                num: index + 1,
                name: element.name,
                fsType: element.fsType,
                label: element.label,
                mount: element.mount,
                size: element.size,
                used: element.used,
                usedPercentage: element.usedPercentage,
                uuid: element.uuid,
                smart: element.smart,
                vendor: element.vendor,
                modelName: element.modelName,
                interface: element.interface,
                diskType: element.diskType,
                removable: element.removable,
                partitionLabels: element.partitionLabels,
                partitions: element.partitions
            })
        })

        res.send(result)
    }).catch(next)
})

// TODO: change to readAllRows
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

routerSysMon.get('/cpuHist', (req, res, next) => {
    let intermedResult = {}
    reader.readAllRows(dbRef.tableCpuInfo, dbRef.getColsCpuInfo().names).then(data => {
        intermedResult.cpu = data
        return reader.readAllRows(dbRef.tableCpuTemp, dbRef.getColsCpuTemp().names)
    }).then(data => {
        let timestamps = []
        let usage = []

        intermedResult.cpu.forEach(element => {
            timestamps.push(element.timestamp)
            usage.push(element.cpuLoad)
        })

        let temperature = Array.from(Array(timestamps.length), () => null)

        data.forEach(element => {
            if (!timestamps.includes(element.timestamp)) {
                let index = sortedIndexToInsert(timestamps, element.timestamp)
                timestamps.splice(index, 0, element.timestamp)

                // add new timestamp index to usage array
                usage.splice(index, 0, null)

                temperature.splice(index, 0 , element.temperature)
            }
        })

        res.send({
            timestamps: timestamps,
            usage: usage,
            temperature: temperature
        })
    }).catch(next)
})

routerSysMon.get('/memInfo', (req, res, next) => {
    reader.readAllRows(
        dbRef.tableMemInfo,
        dbRef.getColsMemInfo().names,
        {
            orderBy: 'timestamp',
            orderOrientation: 'DESC'
        }
    ).then(data => {
        // only send most recent info
        res.send({
            timestamp: data[0].timestamp,
            curMemUsed: data[0].used,
            curMemBuffered: data[0].buffered,
            curMemCached: data[0].cached
        })
    }).catch(next)
})

routerSysMon.get('/memHist', (req, res, next) => {
    reader.readAllRows(dbRef.tableMemInfo, dbRef.getColsMemInfo().names).then(data => {
        let timestamps = []
        let used = []
        let buffered = []
        let cached = []
        let swap = []

        data.forEach(element => {
            timestamps.push(element.timestamp)
            used.push(element.used)
            buffered.push(element.buffered)
            cached.push(element.cached)
            swap.push(element.swap)
        })

        res.send({
            timestamps: timestamps,
            used: used,
            buffered: buffered,
            cached: cached,
            swap: swap,
            swapTotal: data[0].swapTotal
        })
    }).catch(next)
})

module.exports = routerSysMon
