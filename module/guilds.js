const snekfetch = require("snekfetch")
const Promise = require("promise")
const rateLimiter = require('limiter').RateLimiter
const limiter = new rateLimiter(1,2500);

function getGuild(token, guildId){
  return new Promise((resolve, reject)=>{
    limiter.removeTokens(1,()=>{
      snekfetch.get('https://discordapp.com/api/guilds/'+guildId)
      .set("Authorization",token)
      .then((res)=>{resolve(res.body)})
      .catch((e)=>{reject(e)})
    })
  })
}

function getGuilds(token){
  return new Promise((resolve, reject)=>{
    limiter.removeTokens(1,()=>{
      snekfetch.get('https://discordapp.com/api/users/@me/guilds')
      .set("Authorization",token)
      .then((res)=>{resolve(res.body)})
      .catch((e)=>{reject(e)})
    })
  })
}

function getGuildChannels(token,guildId){
  return new Promise((resolve, reject)=>{
    limiter.removeTokens(1,()=>{
      snekfetch.get('https://discordapp.com/api/guilds/'+guildId+'/channels')
      .set("Authorization",token)
      .then((res)=>{resolve(res.body)})
      .catch((e)=>{reject(e)})
    })
  })
}

module.exports.getGuild = getGuild;
module.exports.getGuilds = getGuilds;
module.exports.getGuildChannels = getGuildChannels;