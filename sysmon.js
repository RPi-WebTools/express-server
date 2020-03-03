const si = require('systeminformation')

function getTime () {
    let time = si.time()
    return {
        current: time.current,
        uptime: time.uptime
    }
}

async function getSysInfo () {
    let system = await si.system()
    let cpu = await si.cpu()
    let mem = await si.mem()
    let os = await si.osInfo()

    return {
        manufacturer: system.manufacturer,
        model: system.model,
        version: system.version,
        cpuManufacturer: cpu.manufacturer,
        cpuCores: cpu.cores,
        memTotal: mem.total,
        osDistro: os.distro,
        osCode: os.codename,
        osHostname: os.hostname
    }
}

async function getSysMonHist () {
    let time = getTime()
    let load = await si.currentLoad()
    let temperature = await si.cpuTemperature()
    let mem = await si.mem()

    return {
        timestamp: time.current,
        uptime: time.uptime,
        cpuLoad: load.currentload,
        cpuTemperature: temperature.main,
        memUsed: mem.used,
        memActive: mem.active,
        memBuffered: mem.buffers,
        memSwapUsed: mem.swapused
    }
}

async function getUsersHist () {
    let time = getTime()
    let users = await si.users()

    let result = []
    users.forEach(user => {
        result.push({
            timestamp: time.current,
            user: user.user,
            terminal: user.terminal,
            loginDate: user.date,
            loginTime: user.time,
            ip: user.ip,
            lastCmd: user.command
        })
    })

    return result
}

async function getFsHist() {
    let time = getTime()
    let blkDevices = await si.blockDevices()
    let fsSize = await si.fsSize()

    let result = []
    let deviceinFsSize
    blkDevices.forEach(device => {
        if (device.mount != '') {
            deviceinFsSize = fsSize.find(x => x.mount === device.mount)
            result.push({
                timestamp: time.current,
                name: device.name,
                type: device.type,
                fsType: device.fstype,
                label: device.label,
                mount: device.mount,
                size: device.size,
                used: deviceinFsSize.used,
                usedPercentage: deviceinFsSize.use,
                uuid: device.uuid
            })
        }
    })

    return result
}

async function getFsIoHist() {
    let time = getTime()
    let io = await si.disksIO()

    return {
        timestamp: time.current,
        read: io.rIO,
        write: io.wIO
    }
}

async function getNetHist() {
    let time = getTime()
    let netIfaces = await si.networkInterfaces()
    let netStats = await si.networkStats()

    let result = []
    let ifaceInStats
    let rx
    let tx
    netIfaces.forEach(iface => {
        ifaceInStats = netStats.find(x => x.iface === iface.iface)
        if (typeof ifaceInStats !== 'undefined') {
            rx = ifaceInStats.rx_bytes
            tx = ifaceInStats.tx_bytes
        }
        else {
            rx = 0
            tx = 0
        }
        result.push({
            timestamp: time.current,
            iface: iface.iface,
            ip: iface.ip4,
            mac: iface.mac,
            type: iface.type,
            speed: iface.speed,
            dhcp: iface.dhcp,
            rx: rx,
            tx: tx
        })
    })

    return result
}

async function getDockerInfoHist() {
    let time = getTime()
    let dockerInfo = await si.dockerInfo()

    return {
        timestamp: time.current,
        numContainers: dockerInfo.containers,
        runningContainers: dockerInfo.containersRunning,
        pausedContainers: dockerInfo.containersPaused,
        numImages: dockerInfo.images
    }
}

module.exports.getTime = getTime
module.exports.getSysInfo = getSysInfo
module.exports.getSysMonHist = getSysMonHist
module.exports.getUsersHist = getUsersHist
module.exports.getFsHist = getFsHist
module.exports.getFsIoHist = getFsIoHist
module.exports.getNetHist = getNetHist
module.exports.getDockerInfoHist = getDockerInfoHist
