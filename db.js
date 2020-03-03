const sqlite3 = require('sqlite3').verbose()
let db

let existingColsInTable = []

module.exports.createOrOpenDb = function (filename) {
    console.log('Creating new SQLite database "' + filename + '"...')
    if (typeof filename == 'string' && filename.endsWith('.db')) {
        db = new sqlite3.Database(filename)
    }
    else {
        console.log('Creating failed. Wrong type of filename')
    }
}

module.exports.createTable = function (name, cols) {
    console.log('Creating new table ' + name)

    let colsForCmd = '(id INTEGER PRIMARY KEY AUTOINCREMENT, '

    cols.forEach((element, key, arr) => {
        existingColsInTable.push(element.name)
        colsForCmd += element.name
        colsForCmd += ' '
        colsForCmd += element.type
        if (!Object.is(arr.length - 1, key)) {
            // is not last iteration
            colsForCmd += ', '
        }
        else {
            colsForCmd += ')'
        }
    })

    db.run('CREATE TABLE IF NOT EXISTS ' + name + ' ' + colsForCmd)
    db.serialize()
}

module.exports.dropTable = function (table) {
    console.log('Dropping table ' + table)

    db.run('DROP TABLE IF EXISTS ' + table)
    db.serialize()
}

module.exports.insertRows = function (table, rowData) {
    console.log('Inserting rows into ' + table)

    // TODO: this needs fixing badly
    let tableCols = '('
    existingColsInTable.forEach((element, key, arr) => {
        tableCols += element
        if (!Object.is(arr.length - 1, key)) {
            tableCols += ', '
        }
        else {
            tableCols += ')'
        }
    })

    let insertCmd = ''
    let values = []

    rowData.forEach(element => {
        insertCmd = 'INSERT INTO ' + table + ' ' + tableCols + ' VALUES ('
        values = []
        element.forEach((datapoint, key, arr) => {
            insertCmd += '?'
            values.push(datapoint)
            if (!Object.is(arr.length - 1, key)) {
                insertCmd += ', '
            }
            else {
                insertCmd += ')'
            }
        })
        console.log(insertCmd)
        console.log(values)
        db.run(insertCmd, values)
        db.serialize()
    })
}

module.exports.readAllRows = function (table) {
    console.log('Reading all rows from ' + table)

    return db.all('SELECT * FROM ' + table)
}

module.exports.readAllRowsFromCols = function (table, cols, orderBy = null, orderOrientation = null) {
    console.log('Reading rows from specific cols from ' + table + ' ordered by ' + orderBy)

    tableCols = ''

    cols.forEach((element, key, arr) => {
        tableCols += element
        if (!Object.is(arr.length - 1, key)) {
            tableCols += ', '
        }
    })

    if (!(orderBy == null || orderOrientation == null)) {
        return db.all('SELECT ' + tableCols + ' FROM ' + table + ' ORDER BY ' + orderBy + ' ' + orderOrientation)
    }
    else {
        return db.all('SELECT ' + tableCols + ' FROM ' + table)
    }
}

module.exports.updateColValInRow = function (table, col, newVal, oldVal = null, id = null) {
    if (oldVal == null && id == null) {
        console.log('You have to provide an ID or the current value to change from!')
        return
    }
    else if (oldVal == null) {
        db.run('UPDATE ' + table + ' SET ' + col + ' = ? WHERE ' + col + ' = ?', [newVal, oldVal])
    }
    else if (id == null) {
        db.run('UPDATE ' + table + ' SET ' + col + ' = ? WHERE id = ?', [newVal, id])
    }
    db.serialize()
}

module.exports.closeDb = function () {
    console.log('Closing current SQLite database...')
    
    db.close()
}

module.exports.initDbWithBaseTables = function (dbName) {
    this.createOrOpenDb(dbName)

    // create general sysinfo
    this.dropTable('sysinfo')
    this.createTable('sysinfo', [
        {
            name: 'manufacturer',
            type: 'TEXT'
        },
        {
            name: 'model',
            type: 'TEXT'
        },
        {
            name: 'version',
            type: 'TEXT'
        },
        {
            name: 'cpuManufacturer',
            type: 'TEXT'
        },
        {
            name: 'cpuCores',
            type: 'INTEGER'
        },
        {
            name: 'memTotal',
            type: 'INTEGER'
        },
        {
            name: 'osDistro',
            type: 'TEXT'
        },
        {
            name: 'osCode',
            type: 'TEXT'
        },
        {
            name: 'osHostname',
            type: 'TEXT'
        }
    ])

    // create sysmon history table
    this.dropTable('sysmonHist')
    this.createTable('sysmonHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'uptime',
            type: 'INTEGER'
        },
        {
            name: 'cpuLoad',
            type: 'REAL'
        },
        {
            name: 'cpuTemperature',
            type: 'REAL'
        },
        {
            name: 'memUsed',
            type: 'INTEGER'
        },
        {
            name: 'memActive',
            type: 'INTEGER'
        },
        {
            name: 'memBuffered',
            type: 'INTEGER'
        },
        {
            name: 'memSwapUsed',
            type: 'INTEGER'
        }
    ])

    // create user login history table
    this.dropTable('usersHist')
    this.createTable('usersHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'user',
            type: 'TEXT'
        },
        {
            name: 'terminal',
            type: 'TEXT'
        },
        {
            name: 'loginDate',
            type: 'TEXT'
        },
        {
            name: 'loginTime',
            type: 'TEXT'
        },
        {
            name: 'ip',
            type: 'TEXT'
        },
        {
            name: 'lastCmd',
            type: 'TEXT'
        }
    ])

    // create file system history table
    this.dropTable('fsHist')
    this.createTable('fsHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'name',
            type: 'TEXT'
        },
        {
            name: 'type',
            type: 'TEXT'
        },
        {
            name: 'fsType',
            type: 'TEXT'
        },
        {
            name: 'label',
            type: 'TEXT'
        },
        {
            name: 'mount',
            type: 'TEXT'
        },
        {
            name: 'size',
            type: 'INTEGER'
        },
        {
            name: 'used',
            type: 'INTEGER'
        },
        {
            name: 'usedPercentage',
            type: 'REAL'
        },
        {
            name: 'uuid',
            type: 'TEXT'
        }
    ])

    // create disk IO history table
    this.dropTable('fsioHist')
    this.createTable('fsioHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'read',
            type: 'INTEGER'
        },
        {
            name: 'write',
            type: 'INTEGER'
        }
    ])

    // create network history table
    this.dropTable('netHist')
    this.createTable('netHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'iface',
            type: 'TEXT'
        },
        {
            name: 'ip',
            type: 'TEXT'
        },
        {
            name: 'mac',
            type: 'TEXT'
        },
        {
            name: 'type',
            type: 'TEXT'
        },
        {
            name: 'speed',
            type: 'REAL'
        },
        {
            name: 'dhcp',
            type: 'TEXT'
        },
        {
            name: 'rx',
            type: 'INTEGER'
        },
        {
            name: 'tx',
            type: 'INTEGER'
        }
    ])

    // create docker history table
    this.dropTable('dockerinfoHist')
    this.createTable('dockerinfoHist', [
        {
            name: 'timestamp',
            type: 'INTEGER'
        },
        {
            name: 'numContainers',
            type: 'INTEGER'
        },
        {
            name: 'runningContainers',
            type: 'INTEGER'
        },
        {
            name: 'pausedContainers',
            type: 'INTEGER'
        },
        {
            name: 'numImages',
            type: 'INTEGER'
        }
    ])

    // create docker container table
    // TODO

    // create whatever else needed
    // TODO

    // fill one-time data and init history tables with first data point
    // TODO

    this.closeDb()
}
