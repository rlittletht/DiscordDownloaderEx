
import fetch from 'cross-fetch';
const rateLimiter = require('limiter').RateLimiter
const limiter = new rateLimiter(1, 2500);

// const snekfetch = require("snekfetch")

var userToken = "",
    authenticated = false;

/*----------------------------------------------------------------------------
	%%Function: isAuthenticated
----------------------------------------------------------------------------*/
export function isAuthenticated(): boolean
{
    return authenticated;
}

async function removeLimiterToken(cTokens: number): Promise<void>
{
    return new Promise((resolve, reject) => limiter.removeTokens(1, () => { resolve() }));
}

/*----------------------------------------------------------------------------
	%%Function: authenticate
----------------------------------------------------------------------------*/
export async function authenticate(username: string, password: string): Promise<string>
{
    await removeLimiterToken(1);

    let result: Response = await fetch('https://discordapp.com/api/v6/auth/login',
        {
            method: "POST",
            body: JSON.stringify(
                {
                    "email": username,
                    "password": password
                }),
            headers:
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // ,
            }
        });

    if (result.status != 200)
        throw `failed: ${result.status} ${result.statusText}`;

    authenticated = true;
    let jsonResult = await result.json();
    userToken = jsonResult.token;

    return userToken;
}
