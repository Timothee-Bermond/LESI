const path = require('path')
require('dotenv').config()
const { connectDb } = require('./src/services/mongoose')
const User = require('./src/models/user')
const Match = require('./src/models/match')
const { authentification, authorizeAdmin } = require('./src/middlewares/authentification')

const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000

connectDb().catch(err => console.log(err))

app.use(express.json())
app.use(cookieParser());

app.use("/static", express.static(path.join(__dirname, '/static')))

app.get('/admin', authentification, authorizeAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/users', async (req, res, next) => {
    const user = new User(req.body)

    try {
        const authToken = await user.generateAuthTokenAndSaveUser()
        res.status(201).send({ user, authToken })
    } catch(e) {
        res.status(400).send(e)
    }
    
})

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        const authToken = await user.generateAuthTokenAndSaveUser()  
        res.send({ user, authToken })
    } catch(e) {
        res.status(400).send()
    }
})

app.post('/users/logout', authentification, async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((authToken) => {
            return authToken.authToken !== req.authToken
        })

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

app.post('/users/logout/all', authentification, async (req, res) => {
    try {
        req.user.authTokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

app.get('/users/me', authentification, async (req, res, next) => {
    res.send(req.user)
})

app.patch('/users/me', authentification, async (req, res, next) => {
    const updatedInfo = Object.keys(req.body)

    try {
        updatedInfo.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.delete('/users/me', authentification, async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})


app.post('/match', async (req, res, next) => {
    const match = new Match(req.body)

    try {
        const saveMatch = await match.save()
        res.status(201).send(saveMatch)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

app.get('/match', authentification, async (req, res, next) => {
    try {
        const matchs = await Match.find({})
        res.send(matchs)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.patch('/match/:id', authentification, async (req, res, next) => {
    const matchID = req.params.id

    try {
        const match = await Match.findByIdAndUpdate(matchID, req.body, {
            new: true,
            runValidators: true
        })
        if (!match) return res.status(404).send('Match not found')        
        res.send(match)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.delete('/match/:id', async (req, res, next) => {
    const matchID = req.params.id

    try {
        const match = await Match.findByIdAndDelete(matchID)
        if (!match) return res.status(404).send('Match not found')
        res.send(match)
    } catch(e) {
        res.status(500).send(e)
    }
})

app.get('/', (req, res) => {
    res.redirect(301, './index.html')
})

app.listen(port, () => {
    console.log(`Le serveur est lancé à : http://localhost:${port}`)
})