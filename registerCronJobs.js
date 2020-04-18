const cron = require('node-cron')

const sysmonFetcher = require('./sysmon-fetcher')

/**
 * Set up schedules for all cyclic info
 * @param {string} dbName Path and name of the database file
 * @param {Array<string>} uuids UUIDs known to the system
 */
function registerSchedules (dbName, uuids) {
    // jobs to be run once a day (at 01:00)
    const daily = cron.schedule('0 1 * * *', () => {
        console.log('Running daily cron job to get new data for: fsInfo, fsIoHist, fsHist')
        sysmonFetcher.newData(dbName, 'fsInfo')
        sysmonFetcher.newData(dbName, 'fsIoHist')
        // TODO: need a way to add a new table if a new drive / UUID is added or one is removed
        uuids.forEach(uuid => {
            sysmonFetcher.newData(dbName, 'fsHist', uuid)
        })
    })

    // jobs to be run every hour
    const hourly = cron.schedule('0 */1 * * *', () => {
        console.log('Running hourly cron job to get new data for: userInfo, netInfo')
        sysmonFetcher.newData(dbName, 'userInfo')
        sysmonFetcher.newData(dbName, 'netInfo')
    })

    // jobs to be run every 30 seconds
    const halfMinutely = cron.schedule('*/30 * * * * *', () => {
        console.log('Running cron job every 30 seconds to get new data for: cpuInfo, cpuTemp, memInfo')
        sysmonFetcher.newData(dbName, 'cpuInfo')
        sysmonFetcher.newData(dbName, 'cpuTemp')
        sysmonFetcher.newData(dbName, 'memInfo')
    })

    console.log('Registered cron schedules for:\n- Job run once a day at 01:00\n- Job run once per hour\n- Job run every 30 seconds')

    return {
        daily: daily,
        hourly: hourly,
        halfMinutely: halfMinutely
    }
}

module.exports = registerSchedules
