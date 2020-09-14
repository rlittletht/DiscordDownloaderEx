
import * as Input from "./module/input";
import * as Authenticate from "./module/authenticate";
import * as TsLimiter from "./module/tsLimiter";
import * as Guilds from "./module/guilds";
import * as Download from "./module/download";
import * as Messages from "./module/messages";

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

async function fetchImages(limiter: TsLimiter.ITsLimiter,
    token: string,
    serverId: string,
    channelId: string,
    channelFolder: string,
    messageIdFilterBefore: string,
    images: any): Promise<void>
{
    console.log(`fetchImages: lastmessageid = ${messageIdFilterBefore}`);
    let messageRes: any = await Messages.GetChannelMessages(limiter, token, channelId, messageIdFilterBefore, null, 100);

    if (messageRes.code == 50001)
    {
        console.error("> You lack the permission to access this channel!");
        return;
    }

    if (messageRes.length > 0)
    {
        console.log(
            `messageRes.length=${messageRes.length}; first id=${messageRes[0].id}, last id=${messageRes[messageRes.length
                - 1].id}`);

        messageIdFilterBefore = messageRes[messageRes.length - 1].id;
        for (var m in messageRes)
        {
            for (var a in messageRes[m].attachments)
            {
                var url = messageRes[m].attachments[a].url;
                images.push(url)
            }
        }
        if (messageRes.length > 0)
            await fetchImages(limiter, token, serverId, channelId, channelFolder, messageIdFilterBefore, images);
        else
            await downloadImages(channelId, channelFolder, serverId, images, token);
    }
    else
    {
        await downloadImages(channelId, channelFolder, serverId, images, token);
    }
}

async function downloadImages(channelName: string, channelFolder: string, serverId: string, images: any, token: string):
    Promise<void>
{
    let resp: string = await Input.input(`${images.length} images in found, proceed to download? [Y/N] `);

    if (resp == "y" || resp == "Y")
    {
        console.log("Downloading...")
        await Download.DoDownloadsAsync(_itsLimiter, images, channelFolder);
        console.log("All images downloaded, back to channel list!");
    }
    else {}
}

/*----------------------------------------------------------------------------
	%%Function: main
----------------------------------------------------------------------------*/
async function main()
{
    let token: string = await login();

    console.log(`> Login successful! Token:${token}`);

    while (true)
    {
        let serverId: string = await Guilds.GetServerIdToDownload(_itsLimiter, token);

        if (serverId == null)
            break;

        console.log(`server id to download: ${serverId}`);
        while (true)
        {
            let channelChoiceInfo: Guilds.ChannelChoiceInfo =
                await Guilds.GetChannelToDownload(_itsLimiter, token, serverId);

            if (channelChoiceInfo == null)
                break;

            console.log(
                `choice: ${channelChoiceInfo.ChannelId}/${channelChoiceInfo.FolderName}`);
            //fetchAndDisplayChannels(token, userGuilds[serverIndex].id);
            await fetchImages(_itsLimiter,
                token,
                serverId,
                channelChoiceInfo.ChannelId,
                channelChoiceInfo.FolderName,
                null /*start from the last*/,
                []);
        }
    }
    Input.close();
}

main();


