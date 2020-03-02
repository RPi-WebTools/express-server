const path = require('path')
const express = require('express')
const app = express()
const port = 3000

var database = require('./db.js')

database.initDbWithBaseTables('main.db')

/*database.createDb('test.db')
database.dropTable('testtable')
database.createTable('testtable', [
    {
        name: 'bla',
        type: 'TEXT'
    },
    {
        name: 'blub',
        type: 'TEXT'
    },
    {
        name: 'blurp',
        type: 'INTEGER'
    }
])
database.insertRows('testtable', [
    ['t','e',2],
    ['s','t',1],
    ['n','o',9],
    ['y','e',4]
])
database.closeDb()
*/

app.get('/', (req, res) => res.send('Hello World!'))

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
