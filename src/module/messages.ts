import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';

export async function GetChannelMessages(
    limiter: TsLimiter.ITsLimiter,
    token: string,
    channelId: string,
    messageIdFilterBefore: string,
    messageIdFilterAfter: string,
    limit: number = 50) : Promise<any>
{
    console.log(`getting channel messages for channel ${channelId} (before: ${messageIdFilterBefore}, after: ${messageIdFilterAfter}`);

    let query: string = "?limit=" + limit;

    if (messageIdFilterBefore != null)
        query += `&before=${messageIdFilterBefore}`;
    else if (messageIdFilterAfter != null)
        query += `&after=${messageIdFilterAfter}`;

    await limiter.RemoveTokens(1);

    let urlFetch: string = `https://discordapp.com/api/channels/${channelId}/messages${query}`;
    console.log(`urlFetch: ${urlFetch}`);

    let result: Response = await fetch(urlFetch,
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

    console.log(`complete. result: ${result.status} ${result.statusText}`);

    if (result.status != 200)
        throw `failed: ${result.status} ${result.statusText}`;

    return await result.json();
}

