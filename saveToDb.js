let database = require('./db.js')
let sysmon = require('./sysmon.js')

async function newDataDockerInfoHist(db) {
    let data = await sysmon.getDockerInfoHist()
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

async function newDataNetHist(db) {
    let data = await sysmon.getNetHist()
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
    database.insertRows('netHist', args)
    database.closeDb()
}

// TODO: all the other tables

module.exports.newDataDockerInfoHist = newDataDockerInfoHist
module.exports.newDataNetHist = newDataNetHist
