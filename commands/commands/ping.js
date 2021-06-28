const config = require('../../config.json')
const emojis = require('../../json/emojis.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    commands: 'ping',
    cooldown: 5,
    callback: (client, message, args) => {
        var seconds = parseInt((client.uptime / 1000) % 60),
            minutes = parseInt((client.uptime / (1000 * 60)) % 60),
            hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24),
            days = parseInt((client.uptime / (1000 * 60 * 60 * 24)) % 60)

        days = (days < 10) ? "0" + days : days
        hours = (hours < 10) ? "0" + hours : hours
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds

        const str = `${days} days, ${hours} hours, ${minutes} minutes ${seconds} seconds`

        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setFooter(config.botname)
        .setTimestamp()
        .setDescription(`Pinging...`)

        message.reply({ embed: embed }).then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            const embed2 = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
            .setFooter(config.botname)
            .setTimestamp()
            .setDescription(
                `${emojis.arrowRight} **API Latency:** \`${ping}ms\`\n` + 
                `${emojis.slowmode} **Uptime:** \`${str}\`\n` +
                `${emojis.user} **Total Users:** \`${client.users.cache.size} Users\`\n` + 
                `${emojis.group} **Total Servers:** \`${client.guilds.cache.size} Servers\``
            )    
            resultMessage.edit({ embed: embed2 })
        })
    }
}
