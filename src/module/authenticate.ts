
import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';

var userToken = "",
    authenticated = false;

/*----------------------------------------------------------------------------
	%%Function: isAuthenticated
----------------------------------------------------------------------------*/
export function isAuthenticated(): boolean
{
    return authenticated;
}

/*----------------------------------------------------------------------------
	%%Function: authenticate
----------------------------------------------------------------------------*/
export async function authenticate(limiter: TsLimiter.ITsLimiter, username: string, password: string): Promise<string>
{
    await limiter.RemoveTokens(1);

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
