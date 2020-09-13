
const snekfetch = require("snekfetch")
const rateLimiter = require('limiter').RateLimiter
const limiter = new rateLimiter(1,2500);

var userToken = "",
    authenticated = false;

function isAuthenticated()
{
    return authenticated;
}

function authenticate(username, password)
{
    return new Promise((resolve, reject) => {
        limiter.removeTokens(1, () => {
            snekfetch.post('https://discordapp.com/api/v6/auth/login')
            .send({ "email": username, "password": password })
            .then((res) => { authenticated = true; userToken = res.body.token; resolve(res.body.token)})
            .catch((e)=>{authenticated = false; reject(e)})
        })
    })
}
function deAuthenticate()
{
    return new Promise((resolve, reject) => {
        limiter.removeTokens(1, () => {
            snekfetch.post('https://discordapp.com/api/v6/auth/logout')
            .set("Authorization", userToken)
            .send({ "provider": null, "token": null })
            .then((res) => { authenticated = false; userToken = ""; resolve(true)})
            .catch((e)=>{reject(e)})
        })
    })
}
function token()
{
    return userToken;
}


module.exports.isAuth = isAuthenticated;
module.exports.authenticate = authenticate;
module.exports.deauth = deAuthenticate;
module.exports.token = token;
