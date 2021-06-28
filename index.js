const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
require('dotenv').config()
require('discord-reply')

const loadCommands = require('./commands/load-commands.js')
const economy = require('./utils/economy.js')
const loadEvents = require('./events/load-events.js')

client.on('ready', () => {
    console.log('The Bot is Online!')
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'}).catch(console.error)

    loadCommands(client)
    loadEvents(client)
    economy(client)
})

client.login(process.env.CLIENT_TOKEN)