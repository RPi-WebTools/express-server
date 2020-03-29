const sqlite3 = require('sqlite3').verbose()

/**
 * Data Access Object to access a sqlite3 database
 */
class DAO {
    /**
     * Create the DAO
     * @param {string} dbName Path to db
     */
    constructor(dbName) {
        if (typeof dbName == 'string' && dbName.endsWith('.db')) {
            this.db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (error) => {
                if (error) console.log('Connect to db failed!', error)
            })
        }
        else {
            this.db = null
            console.log('Wrong type of filename')
        }
    }

    /**
     * Serialize queries
     * @param {*} callback What should be serialized
     */
    serialize (callback) {
        return this.db.serialize(callback)
    }

    /**
     * Parallelize queries
     * @param {*} callback What should be parallelized
     */
    parallelize (callback) {
        return this.db.parallelize(callback)
    }

    /**
     * Get all rows from db
     * @param {string} sqlCmd SQL command to run
     * @param {Array} params Further options
     * @return {Promise} Contains the returned rows
     */
    all (sqlCmd, params=[]) {
        return new Promise((resolve, reject) => {
            this.db.all(sqlCmd, params, (error, rows) => {
                if (error) {
                    console.log('Error running sql command: ' + sqlCmd)
                    console.log(error)
                    reject(error)
                }
                else {
                    resolve(rows)
                }
            })
        })
    }

    /**
     * Get a row from db
     * @param {string} sqlCmd SQL command to run
     * @param {Array} params Further options
     * @return {Promise} Contains the returned first row
     */
    get (sqlCmd, params=[]) {
        return new Promise((resolve, reject) => {
            this.db.get(sqlCmd, params, (error, row) => {
                if (error) {
                    console.log('Error running sql command: ' + sqlCmd)
                    console.log(error)
                    reject(error)
                }
                else {
                    resolve(row)
                }
            })
        })
    }
}

module.exports = DAO
