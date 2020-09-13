
import * as Input from "./module/input";
import * as Authenticate from "./module/authenticate";
import * as TsLimiter from "./module/tsLimiter";
import * as Guilds from "./module/guilds";

let _itsLimiter: TsLimiter.ITsLimiter = TsLimiter.CreateLimiter(1, 2500);

/*----------------------------------------------------------------------------
	%%Function: login
	
    login to discord and return a bearer token
----------------------------------------------------------------------------*/
async function login(): Promise<string>
{
    let username: string = await Input.input("> Username:");
    let password: string = await Input.input("> Password:");

    let token: string = null;

    try
    {
        token = await Authenticate.authenticate(_itsLimiter, username, password);
    }
    catch (error)
    {
        console.log(`> Login unsuccessful! (${error})`);
        return await login();
    }

    // console.log('\033[2J');
    console.log(`> Login successful!`);
    return token;
}

/*----------------------------------------------------------------------------
	%%Function: main
----------------------------------------------------------------------------*/
async function main()
{
    let token: string = await login();

    console.log(`> Login successful! Token:${token}`);
    let serverId: string = await Guilds.GetServerIdToDownload(_itsLimiter, token);

    console.log(`server id to download: ${serverId}`);
    //fetchAndDisplayChannels(token, userGuilds[serverIndex].id);
    Input.close();
}

main();


