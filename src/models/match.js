const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
    Team1: {
        type : String,
        enum: ['Team 412', 'Guiche OPEX', 'Al Zultan', 'NOSEtradamus', 'SIT', 'Turbo Wizards', 'Big Titteams'],
        required : true
    },
    Team2: {
        type : String,
        enum: ['Team 412', 'Guiche OPEX', 'Al Zultan', 'NOSEtradamus', 'SIT', 'Turbo Wizards', 'Big Titteams'],
        required : true
    },
    Semaine: {
        type : Number,
        required : true
    },
    Phase: {
        type : String,
        required : true
    },
    Ban1Team1: {
        type : String
    },
    Ban2Team1: {
        type : String
    },
    Ban1Team2: {
        type : String
    },
    Ban2Team2: {
        type : String
    },
    Pick1Team1: {
        type : String
    },
    Pick2Team1: {
        type : String
    },
    Pick3Team1: {
        type : String
    },
    Pick1Team2: {
        type : String
    },
    Pick2Team2: {
        type : String
    },
    Pick3Team2: {
        type : String
    }
})

const Match = mongoose.model('Match', matchSchema)

module.exports = Match