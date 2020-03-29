const express = require('express')
const routerSysServ = express.Router()

routerSysServ.use((req, res, next) => {
    console.log('sysserv router hit for: %s', req.originalUrl)
    next()
})

routerSysServ.get('/test', (req, res) => res.send('Test message'))

routerSysServ.get('/testData', (req, res) => res.send({
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

module.exports = routerSysServ
