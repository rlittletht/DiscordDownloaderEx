import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';

/*
export async function getGuild(limiter, token, guildId): Promise<any>
{
    await limiter.RemoveTokens(1);
    let result: Response = await fetch('https://discordapp.com/api/guilds/' + guildId,
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

    if (result.status != 200)
        throw `failed: ${result.status} ${result.statusText}`;

    let jsonResult = await result.json();

    return jsonResult.
}


function getGuildChannels(token, guildId)
{
    return new Promise((resolve, reject) =>
    {
        limiter.removeTokens(1, () =>
        {
            snekfetch.get('https://discordapp.com/api/guilds/' + guildId + '/channels')
                .set("Authorization", token)
                .then((res) => { resolve(res.body) })
                .catch((e) => { reject(e) })
        })
    })
}

*/

export async function getGuilds(limiter: TsLimiter.ITsLimiter, token: string): Promise<any>
{
    await limiter.RemoveTokens(1);
    let result: Response = await fetch('https://discordapp.com/api/users/@me/guilds',
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

    if (result.status !== 200)
        throw `failed: ${result.status} ${result.statusText}`;

    return await result.json();
}



