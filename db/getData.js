const DAO = require('./dao')

class SQLiteReader {
    /**
     * Reader for SQLite databases
     * @param {DAO} dao 
     */
    constructor (dao) {
        this.dao = dao
    }

    /**
     * Serialize queries
     * @param {*} callback What should be serialized
     */
    serialize (callback) {
        return this.dao.serialize(callback)
    }

    /**
     * Parallelize queries
     * @param {*} callback What should be parallelized
     */
    parallelize (callback) {
        return this.dao.parallelize(callback)
    }

    /**
     * Read all rows (of given columns)
     * @param {string} table Name of the table
     * @param {Array<string>} cols Which columns to include in the query, provide none for all
     * @param {Array} params 
     */
    readAllRows (table, cols=[], params=[]) {
        let sqlCmd = 'SELECT '
        
        // set columns
        if (!cols.length) sqlCmd += '* '
        else sqlCmd += cols.join(', ')

        // set table
        sqlCmd += 'FROM ' + table

        if (params.length) {
            sqlCmd += ' '
            
            // set order
            if (params.orderBy) {
                sqlCmd += 'ORDER BY ' + params.orderBy
            }
            if (params.orderOrientation) {
                sqlCmd += ' ' + params.orderOrientation
            }

            // set filter
            if (params.whereCol && params.whereCompare) {
                sqlCmd += ' WHERE ' + params.whereCol + ' = ' + params.whereCompare
            }
        }
        sqlCmd += ';'

        return this.dao.all(sqlCmd)
    }
}

module.exports = SQLiteReader
