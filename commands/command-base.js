const config = require('../config.json')
const emojis = require('../json/emojis.json')
const { MessageEmbed } = require('discord.js')
let recentlyRan = []

module.exports = (client, commandOptions) => {
    let{
        commands,
        cooldown = -1,
        callback,
    } = commandOptions

    if(!commands){
        return
    }

    if(typeof commands === 'string'){
        commands = [commands]
    }
    console.log(`Registering command "${commands[0]}"`)

    client.on('message', async (message) => {
        const { member, content, guild, channel } = message

        const args = content.split(/[ ]+/)
        args.shift()

        for(const alias of commands){
            const command = `${config.prefix}${alias.toLowerCase()}`

            if(
                content.toLowerCase().startsWith(`${command}`) ||
                content.toLowerCase() === command
            ){

                let cooldownString = `${guild.id}-${member.id}-${commands[0]}`
                console.log('cooldownString: ', cooldownString)

                if(cooldown > 0 && recentlyRan.includes(cooldownString)){
                    const embed = new MessageEmbed()
                    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                    .setDescription(`${emojis.no} You are using the commands very quickly! Please wait for some time to use the command again!\n**TIP:** A premium server has half the cooldown!`)
                    .setColor('RED')
                    .setFooter(config.botname)
                    .setTimestamp()
                    message.lineReply(embed).then((message) => {
                        message.delete({
                            timeout: 5000
                        })
                    })
                    message.delete()
                    return
                }

                if(cooldown > 0){
                    recentlyRan.push(cooldownString)
                    setTimeout(() => {
                        console.log('BEFORE: ', recentlyRan)
                        recentlyRan = recentlyRan.filter((string) => {
                            return string !== cooldownString
                        })

                        console.log('AFTER: ', recentlyRan)
                    }, 1000 * cooldown)
                }
                callback(client, message, args, args.join(' '))
                return
            }
        }
    })
}