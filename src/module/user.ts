import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';
import * as Input from "./input";

export async function GetUserChannels(limiter: TsLimiter.ITsLimiter, token: string): Promise<any>
{
    await limiter.RemoveTokens(1);

    let result: Response = await fetch('https://discordapp.com/api/users/@me/channels',
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
