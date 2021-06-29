const config = require('../../../config.json')
const emojis = require('../../../json/emojis.json')
const economy = require('../../../utils/economy')
const { MessageEmbed } = require('discord.js')

module.exports = {
    commands: ['bal', 'balance'],
    cooldown: 5,
    callback: (client, message, args) => {
        let target
        if(message.mentions.members.first()) {
            target = message.mentions.members.first()
        }else if(args[0]) {
            target = message.guild.members.cache.get(args[0])
        } else {
            target = message.guild.members.cache.get(message.author.id)
        }

        const user = await economy.fetchCoins(target.id, message.guild.id)
        const embed = new MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
        .setColor('GREEN')
        .setFooter(config.botname)
        .setTimestamp()
        .setDescription(`${emojis.currency} **Balance for <@${target.id}>:** ${user.coins} `)
        message.lineReply({ embed: embed })
    }
}