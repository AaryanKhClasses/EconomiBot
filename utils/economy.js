const economyModel = require('../models/economyModel')
const mongoose = require('mongoose')
var mongoUrl

static async setURL(dbUrl) {
    if(!dbUrl) throw new TypeError("A database URL was not provided or the URL Provided is invalid!")
    mongoUrl = dbUrl
    return mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
}

static async addCoins(userID, guildID, coins) {
    if(!userID) throw new TypeError("A User ID wasn't provided while adding coins")
    if(!guildID) throw new TypeError("A Guild ID wasn't provided while adding coins")
    if(!coins || coins == 0 || isNaN(parseInt(coins))) throw new TypeError("An amount of Coins(or any other currency) wasn't specified or was invalid!")

    const user = await economyModel.findOne({ userID: userID, guildID: guildID })
    if(!user) {
        const newUser = new economyModel({
            userID: userID,
            guildID: guildID,
            coins: coins,
            level: Math.floor(0.1 * Math.sqrt(coins))
        })

        await newUser.save().catch(e => console.log('Failed to save the new user!'))
        return (Math.floor(0.1 * Math.sqrt(coins)) > 0)
    }
    user.coins += parseInt(coins, 10)

    await user.save().catch(e => console.log(`Failed to add coins: ${e}`) )
    return (Math.floor(0.1 * Math.sqrt(user.coins -= coins)) < user.level)
}

static async setCoins(userID, guildID, coins) {
    if(!userID) throw new TypeError("A User ID wasn't provided while setting coins")
    if(!guildID) throw new TypeError("A Guild ID wasn't provided while setting coins")
    if(!coins || coins == 0 || isNaN(parseInt(coins))) throw new TypeError("An amount of coins(or any other currency) wasn't specified or was invalid!")

    const user = await economyModel.findOne({ userID: userID, guildID: guildID })
    if (!user) return false
    user.coins = coins

    user.save().catch(e => console.log(`Failed to set coins: ${e}`) )
    return user
}

    static async fetchCoins(userID, guildID, fetchPosition = false) {
    if(!userID) throw new TypeError("A User ID wasn't provided while fetching coins")
    if(!guildID) throw new TypeError("A Guild ID wasn't provided while fetching coins")

    const user = await economyModel.findOne({
        userID: userID,
        guildID: guildID
    })
    if (!user) return false

    if (fetchPosition === true) {
        const leaderboard = await economyModel.find({
            guildID: guildID
        }).sort([['xp', 'descending']]).exec()

        user.position = leaderboard.findIndex(i => i.userID === userID) + 1
    }
    return user
}

static async subtractCoins(userID, guildID, coins) {
    if (!userID) throw new TypeError("An user id was not provided while subtracting coins.")
    if (!guildID) throw new TypeError("A guild id was not provided while subtracting coins.")
    if (coins == 0 || !coins || isNaN(parseInt(coins))) throw new TypeError("An amount of coins(or any other currency) was not provided or was invalid.")

    const user = await economyModel.findOne({ userID: userID, guildID: guildID })
    if (!user) return false

    user.coins -= coins
    user.save().catch(e => console.log(`Failed to subtract coins: ${e}`) )
    return user
}

static async fetchCoinsLeaderboard(guildID, limit) {
    if (!guildID) throw new TypeError("A guild id was not provided while fetching leaderboard.")
    if (limit == 0 || !limit || isNaN(parseInt(limit))) throw new TypeError("An amount of limit was not provided or was invalid.")

    var users = await economyModel.find({ guildID: guildID }).sort([['xp', 'descending']]).exec()
    return users.slice(0, limit)
}

static async computeCoinsLeaderboard(client, leaderboard, fetchUsers = false) {
    if (!client) throw new TypeError("A client was not provided while computing leaderboard.")
    if (!leaderboard) throw new TypeError("A leaderboard id was not provided.")

    if (leaderboard.length < 1) return []

    const computedArray = []

    if (fetchUsers) {
    for (const key of leaderboard) {
        const user = await client.users.fetch(key.userID) || { username: "Unknown", discriminator: "0000" }
        computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            coins: key.coins,
            position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
            username: user.username,
            discriminator: user.discriminator
        })
    }
    } else {
        leaderboard.map(key => computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            coins: key.coins,
            level: key.level,
            position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
            username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown",
            discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
        }))
    }
    return computedArray
}