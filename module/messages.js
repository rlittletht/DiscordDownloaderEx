const snekfetch = require("snekfetch")
const Promise = require("promise")
const rateLimiter = require('limiter').RateLimiter
const limiter = new rateLimiter(1,2500);

function getChannelMessages (token, channelId, before, after, limit=50){
  var query = "?limit="+limit;
  before ? query+="&before="+before : query+= "";
  after ? query+="&after="+after : query+= "";
  return new Promise((resolve, reject)=>{
    limiter.removeTokens(1,()=>{
      snekfetch.get(`https://discordapp.com/api/channels/${channelId}/messages${query}`)
      .set("Authorization",token)
      .then((res)=>{resolve(res.body)})
      .catch((e)=>{reject(e)})
    })
  })
}

module.exports.getChannelMessages = getChannelMessages;
