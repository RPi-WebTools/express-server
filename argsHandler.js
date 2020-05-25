const yargs = require('yargs')

const argv = yargs
    .scriptName('server.js')
    .usage('$0 [args]')
    .option('e', {
        alias: 'endpointDav',
        default: 'http://192.168.100.100/dav.php',
        describe: 'URL at which to find the CalDAV server',
        type: 'string'
    })
    .option('u', {
        alias: 'userDav',
        default: 'viperinius',
        describe: 'CalDAV user to use for connection',
        type: 'string'
    })
    .option('p', {
        alias: 'pwdDav',
        default: '',
        describe: 'CalDAV password to use',
        type: 'string'
    })
    .option('l', {
        alias: 'lang',
        default: 'en-US',
        describe: 'Language to use with tvspotter',
        type: 'string'
    })
    .demandOption(['e', 'u', 'p'], 'Please provide all required parameters (endpointDav, userDav, pwdDav).')
    .help()
    .argv

if (argv.e) {
    console.log('Endpoint set to: ' + argv.e)
}

if (argv.u) {
    console.log('DAV user set to: ' + argv.u)
}

if (argv.p) {
//     console.log('Password set to: ' + argv.p)
    console.log('DAV Password set.')
}

if (argv.l) {
    console.log('Language set to: ' + argv.l)
}

module.exports = argv