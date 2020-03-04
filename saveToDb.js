let database = require('./db.js')
let sysmon = require('./sysmon.js')

async function newDataSysInfo (db) {
    let data = await sysmon.getSysInfo()
    let cols = [
        'manufacturer',
        'model',
        'version',
        'cpuManufacturer',
        'cpuCores',
        'memTotal',
        'osDistro',
        'osCode',
        'osHostname'
    ]

    database.createOrOpenDb(db)
    database.insertRows('sysinfo', cols, [
        [
            data.manufacturer,
            data.model,
            data.version,
            data.cpuManufacturer,
            data.cpuCores,
            data.memTotal,
            data.osDistro,
            data.osCode,
            data.osHostname
        ]
    ])
    database.closeDb()
}

async function newDataSysMonHist (db) {
    let data = await sysmon.getSysMonHist()
    let cols = [
        'timestamp',
        'uptime',
        'cpuLoad',
        'cpuTemperature',
        'memUsed',
        'memActive',
        'memBuffered',
        'memSwapUsed'
    ]

    database.createOrOpenDb(db)
    database.insertRows('sysmonHist', cols, [
        [
            data.timestamp,
            data.uptime,
            data.cpuLoad,
            data.cpuTemperature,
            data.memUsed,
            data.memActive,
            data.memBuffered,
            data.memSwapUsed
        ]
    ])
    database.closeDb()
}

async function newDataUsersHist (db) {
    let data = await sysmon.getUsersHist()
    let cols = [
        'timestamp',
        'user',
        'terminal',
        'loginDate',
        'loginTime',
        'ip',
        'lastCmd'
    ]
    let args = []
    data.forEach(element => {
        args.push([
            element.timestamp,
            element.user,
            element.terminal,
            element.loginDate,
            element.loginTime,
            element.ip,
            element.lastCmd
        ])
    })

    database.createOrOpenDb(db)
    database.insertRows('usersHist', cols, args)
    database.closeDb()
}

async function newDataFsHist (db) {
    let data = await sysmon.getFsHist()
    let cols = [
        'timestamp',
        'name',
        'type',
        'fsType',
        'label',
        'mount',
        'size',
        'used',
        'usedPercentage',
        'uuid'
    ]
    let args = []
    data.forEach(element => {
        args.push([
            element.timestamp,
            element.name,
            element.type,
            element.fsType,
            element.label,
            element.mount,
            element.size,
            element.used,
            element.usedPercentage,
            element.uuid
        ])
    })

    database.createOrOpenDb(db)
    database.insertRows('fsHist', cols, args)
    database.closeDb()
}

async function newDataFsIoHist (db) {
    let data = await sysmon.getFsIoHist()
    let cols = [
        'timestamp',
        'read',
        'write'
    ]

    database.createOrOpenDb(db)
    database.insertRows('fsioHist', cols, [
        [
            data.timestamp,
            data.read,
            data.write
        ]
    ])
    database.closeDb()
}

async function newDataNetHist (db) {
    let data = await sysmon.getNetHist()
    let cols = [
        'timestamp',
        'iface',
        'ip',
        'mac',
        'type',
        'speed',
        'dhcp',
        'rx',
        'tx'
    ]
    let args = []
    data.forEach(element => {
        args.push([
            element.timestamp,
            element.iface,
            element.ip,
            element.mac,
            element.type,
            element.speed,
            element.dhcp,
            element.rx,
            element.tx
        ])
    })

    database.createOrOpenDb(db)
    database.insertRows('netHist', cols, args)
    database.closeDb()
}

async function newDataDockerInfoHist (db) {
    let data = await sysmon.getDockerInfoHist()
    let cols = [
        'timestamp',
        'numContainers',
        'runningContainers',
        'pausedContainers',
        'numImages'
    ]
    database.createOrOpenDb(db)
    database.insertRows('dockerinfoHist', [
        [
            data.timestamp, 
            data.numContainers, 
            data.runningContainers, 
            data.pausedContainers, 
            data.numImages
        ]
    ])
    database.closeDb()
}

module.exports.newDataSysInfo = newDataSysInfo
module.exports.newDataSysMonHist = newDataSysMonHist
module.exports.newDataUsersHist = newDataUsersHist
module.exports.newDataFsHist = newDataFsHist
module.exports.newDataFsIoHist = newDataFsIoHist
module.exports.newDataNetHist = newDataNetHist
module.exports.newDataDockerInfoHist = newDataDockerInfoHist
