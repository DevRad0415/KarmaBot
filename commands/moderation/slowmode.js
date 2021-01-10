const ms = require('ms');
const humanize = require('humanize-duration');

const Discord = require('discord.js');
const config = require('../../configs/config.json');


module.exports = {
    config: {
        name: 'slowmode',
        description: 'Add a slowmode on a certain channel.',
        aliases: ["sm", "ratelimit"],
        usage: '[#channel] <10s/m/h>',
        accessableby: "Moderators",
    },
    run: async (client, message, args) => {
        if(!message.author.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You are missing manage channels permission for this command!")
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send("I am missing manage channels permission for this command")
        let channel =  message.mentions.channels.first() ? message.mentions.channels.first() : message.channel;
        
        let time = message.mentions.channels.first() ? args[1] : args[0];
        
        if(!time) {
            return message.channel.send("Please insert a time. **e.g 10s, 20m, 3h**");
        } else if(time.toLowerCase() === "reset" || time.toLowerCase() === "off") {
            if(channel.rateLimitPerUser < 1) return message.channel.send("This/that channel doesn't have a slowmode.")
            await channel.setRateLimitPerUser(0);
            return message.channel.send(`<#${channel.id}> slowmode has been lifted.`);
        }
        
        let toMS = ms(time);
        let result  = Math.floor(toMS / 1000);
        
        if(!result) return message.channel.send("Please insert a valid time. **e.g 10s, 20m, 3h**");
        
        if(result > 21600) return message.channel.send("Time should be less than or equal to 6 hours.");
        else if(result < 1) return message.channel.send("Time should be more than or equal to 1 second. (you can use **off** or **reset** to disable the slowmode.)")
        
        await channel.setRateLimitPerUser(result);
        return message.channel.send(`<#${channel.id}> slowmode is now **${humanize(toMS)}**.`)
    } 
}
