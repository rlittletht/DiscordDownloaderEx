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

*/

/*----------------------------------------------------------------------------
	%%Function: GetGuildChannels
	
----------------------------------------------------------------------------*/
async function GetGuildChannels(limiter: TsLimiter.ITsLimiter, token: string, guildId: string): Promise<any>
{
    await limiter.RemoveTokens(1);

    let result: Response = await fetch('https://discordapp.com/api/guilds/' + guildId + '/channels',
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

    if (result.status != 200)
        throw `failed: ${result.status} ${result.statusText}`;

    return await result.json();
}


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

/*----------------------------------------------------------------------------
	%%Function: DescribeChannel
----------------------------------------------------------------------------*/
function DescribeChannel(channel): string
{
    if (channel.name)
        return `${channel.name} (${channel.id})`;

    let userNames: string = "@Me";

    if (channel.recipients)
    {
        for (var i in channel.recipients)
            userNames += `, ${channel.recipients[i].username}`;
    }

    return `unnamed between (${userNames})`;
}

/*----------------------------------------------------------------------------
	%%Function: FolderNameForChannel
----------------------------------------------------------------------------*/
async function FolderNameForChannel(channel): Promise<string>
{
    if (channel.name)
        return channel.name;

    let folderName: string = await Input.input(`Cannot automatically generate folder name for channel. Destination folder name? `);

    return folderName;
}

export interface ChannelChoiceInfo
{
    ChannelId: string;
    LastMessageId: string;
    FolderName: string;
};

/*----------------------------------------------------------------------------
	%%Function: GetChannelChoiceInfoToDownload
----------------------------------------------------------------------------*/
export async function GetChannelChoiceInfoToDownload(channels): Promise<ChannelChoiceInfo>
{
    for (var c in channels)
    {
        console.log(`[${c}] - ${DescribeChannel(channels[c])}`);
    }

    let channelIndex: string = await Input.input(`What channel do you want to download from? [0-${channels.length - 1}]`);

    let iChannel: number = parseInt(channelIndex);

    if (iChannel >= 0 && iChannel < channels.length)
    {
        let folderName: string = await FolderNameForChannel(channels[iChannel]);
        return {
            ChannelId: channels[iChannel].id,
            FolderName: folderName,
            LastMessageId: channels[iChannel].last_message_id
        };
    }

    return null;
}

/*----------------------------------------------------------------------------
	%%Function: GetChannelToDownload
----------------------------------------------------------------------------*/
export async function GetChannelToDownload(limiter: TsLimiter.ITsLimiter, token: string, serverid: string):
    Promise<ChannelChoiceInfo>
{
    /*    if (serverid === '!!user')
        {
            user.getUserChannels(token)
                .then((channels) => displayChannels(token, channels))
                .catch((error) => { console.log(error); })
        }
        else */
    {
        let channels = await GetGuildChannels(limiter, token, serverid);
        return await GetChannelChoiceInfoToDownload(channels);
    }
}
