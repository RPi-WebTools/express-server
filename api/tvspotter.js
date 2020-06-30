const fs = require('fs')
const path = require('path')
const express = require('express')
const { check, validationResult } = require('express-validator')
const argv = require('../argsHandler')

const routerTVspotter = express.Router()

const TVspotter = require('../TVspotter')
const sleep = require('../sysmon-fetcher').sleep

let spotter = new TVspotter(argv.e, argv.u, argv.p, argv.l)
const dbName = path.resolve(path.join(__dirname, '../TVspotter'), 'tvspotter.db')

if (!fs.existsSync(dbName)) {
    // this is async!
    sleep(2000).then(() => spotter.initialise(true))
}

routerTVspotter.use((req, res, next) => {
    console.log('tvspotter router hit for: %s', req.originalUrl)
    next()
})

routerTVspotter.use(express.urlencoded({ extended: true }))
routerTVspotter.use(express.json())

routerTVspotter.post('/search/:type', [
    check('search', 'Search must not be empty')
        .exists()
        .isString()
        .not().isEmpty()
        .trim()
        .escape()
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    if (req.params.type !== 'movie' && req.params.type !== 'tv') {
        return res.status(400).json({ errors: 'Wrong search type!' })
    }

    spotter.search(req.params.type, req.body.search, 1).then(result => res.send(result))
})

routerTVspotter.post('/check/:type', [
    check('tmdb_id', 'ID is empty or malformed')
        .exists()
        .isNumeric(),
    check('days_range', 'Days difference is empty or malformed')
        .exists()
        .isInt({ min: 0 })
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    if (req.params.type === 'movie') {
        spotter.checkMovie(req.body.tmdb_id, req.body.days_range, true).then(result => {
            spotter.checkIfStored(result.tmdbId, 'movie').then(isStored => {
                if (!isStored) {
                    spotter.storeMovies(result)
                }
                else {
                    spotter.updateStored(result.tmdbId, result, 'movie')
                }
                res.send(result)
            })
        })
    }
    else if (req.params.type === 'tv') {
        spotter.checkTV(req.body.tmdb_id, req.body.days_range, true).then(result => {
            spotter.checkIfStored(result.tmdbId, 'tv').then(isStored => {
                if (!isStored) {
                    spotter.storeTV(result)
                }
                else {
                    spotter.updateStored(result.tmdbId, result, 'tv')
                }
                res.send(result)
            })
        })
    }
    else {
        return res.status(400).json({ errors: 'Wrong check type!' })
    }
})

routerTVspotter.post('/delete/:type', [
    check('tmdb_id', 'ID is empty of malformed')
        .exists()
        .isNumeric()
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    if (req.params.type === 'movie') {
        spotter.removeStored(req.body.tmdb_id, 'movie')
        res.send(true)
    }
    else if (req.params.type === 'tv') {
        spotter.removeStored(req.body.tmdb_id, 'tv')
        res.send(true)
    }
    else {
        return res.status(400).json({ errors: 'Wrong check type!' })
    }
})

routerTVspotter.get('/load/watched/:type', (req, res) => {
    if (req.params.type === 'movie') {
        spotter.readMovies().then(data => res.send(data))
    }
    else if (req.params.type === 'tv') {
        spotter.readTV().then(data => res.send(data))
    }
    else {
        return res.status(400).json({ errors: 'Wrong check type!' })
    }
})

routerTVspotter.get('/load/upcoming/:type', (req, res) => {
    if (req.params.type === 'movie') {
        spotter.getMovieUpcoming().then(data => res.send(data))
    }
    else if (req.params.type === 'tv') {
        spotter.getTVOnTheAir().then(data => res.send(data))
    }
    else {
        return res.status(400).json({ errors: 'Wrong check type!' })
    }
})

routerTVspotter.get('/load/today', (req, res) => {
    spotter.getTVAiringToday().then(data => res.send(data))
})

module.exports = routerTVspotter