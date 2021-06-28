const fs = require('fs')
const path = require('path')

module.exports = (client) => {
        const readEvents = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()){
                readEvents(path.join(dir, file))
            } else if(file !== 'load-events.js'){
                const event = require(path.join(__dirname, dir, file))
                console.log(`Enabling event "${file}"`)
                event(client)
            }
        }
    }

    readEvents('.')
} 