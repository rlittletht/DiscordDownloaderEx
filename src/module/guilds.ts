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

export async function displayServers(limiter: TsLimiter.ITsLimiter, token: string): Promise<any>
{
    let userGuilds = await getGuilds(limiter, token);

    userGuilds.push({ name: "User channels", id: "!!user" });
    for (var i in userGuilds)
    {
        console.log(`[${i}] - ${userGuilds[i].name}`);
    }

/*    readLine(`> Which server do you want to download? [0-${results.length - 1}]\n`).then((serverIndex) =>
            {
                if (serverIndex >= 0 && serverIndex < results.length)
                {
                    savedServerId = userGuilds[serverIndex].id;
                    fetchAndDisplayChannels(token, userGuilds[serverIndex].id);
                }
                else
                {
                    //Recursion
                    //displayServers(token);
                }
            });
        })
        .catch((error) =>
        {
            console.error(`Error retrieving guild list!`);
            console.log(error);
            //Possibly crash out or retry.
        })
        */
}
