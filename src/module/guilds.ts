import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';
import * as Input from "./input";

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

async function getGuilds(limiter: TsLimiter.ITsLimiter, token: string): Promise<any>
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


/*----------------------------------------------------------------------------
	%%Function: GetServerIdToDownload
----------------------------------------------------------------------------*/
export async function GetServerIdToDownload(limiter: TsLimiter.ITsLimiter, token: string): Promise<string>
{
    let userGuilds = await getGuilds(limiter, token);

    userGuilds.push({ name: "User channels", id: "!!user" });
    for (var i in userGuilds)
    {
        console.log(`[${i}] - ${userGuilds[i].name}`);
    }

    let serverIndex: string = await Input.input(`Which server do you want to download? [0-${userGuilds.length - 1}] `);

    let iServer: number = parseInt(serverIndex);

    if (iServer >= 0 && iServer < userGuilds.length)
    {
        return userGuilds[iServer].id;
    }
    else
    {
        return null;
    }
}
