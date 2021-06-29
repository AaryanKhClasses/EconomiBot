const economy = require('mongoose')
require('dotenv').config()
const a = 20 
economy.setURL(process.env.MONGOPASS)
module.exports = async(client) => {
    client.on('message', async(message) => {
        if(!message.guild) return 
        if(message.author.bot) return 
        if(message.content.startsWith('!')) return 
        
        const randomCoins = Math.floor(Math.random() * a) + 1
        await economy.addCoins(message.author.id, message.guild.id, randomCoins)
    })
}