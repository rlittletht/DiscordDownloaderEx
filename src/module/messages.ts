import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';

export async function GetChannelMessages(
    limiter: TsLimiter.ITsLimiter,
    token: string,
    channelId: string,
    before,
    after,
    limit: number = 50) : Promise<any>
{
    console.log(`getting channel messages for channel ${channelId} (before: ${before}, after: ${after}`);

    let query: string = "?limit=" + limit;
    before ? query += "&before=" + before : query += "";
    after ? query += "&after=" + after : query += "";

    await limiter.RemoveTokens(1);

    let result: Response = await fetch(`https://discordapp.com/api/channels/${channelId}/messages${query}`,
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

