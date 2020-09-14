import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';
import * as fs from 'fs';

const download = require('image-downloader');
const downloadDir = process.cwd() + "\\downloads\\";

async function StatAsync(fullpath): Promise<any>
{
    return new Promise<any>((resolve, reject) =>
    {
        fs.stat(fullpath,
            (err, stat) =>
            {
                if (err == null)
                    resolve(stat);
                else
                    reject(err);
            });
    });
}

async function MkdirAsync(fullpath): Promise<any>
{
    return new Promise<any>((resolve, reject) =>
    {
        fs.mkdir(fullpath,
            (err) =>
            {
                if (err)
                    reject(err);
                resolve();
            });
    });
}

/*----------------------------------------------------------------------------
	%%Function: DoDownloadsAsync
----------------------------------------------------------------------------*/
export async function DoDownloadsAsync(
    limiter: TsLimiter.ITsLimiter,
    imageList: string[],
    folder: string): Promise<void>
{
    let counter: number = 0;
    let maxCounter: number = imageList.length;

    try
    {
        await MkdirAsync(downloadDir + folder + "\\");
    }
    catch (err)
    {
        if (err.code != 'EEXIST')
            throw `mkdir failed: ${err}`;
    }

    for (var index in imageList)
    {
        counter++;
        let urlImage: string = imageList[index];

        let fileName: string = urlImage.split("/")[urlImage.split("/").length - 1];
        let fullPath: string = downloadDir + folder + "\\" + fileName;
        let err = null;

        try
        {
            await StatAsync(fullPath);
        }
        catch (errCaught)
        {
            err = errCaught;
        }

        if (err == null)
        {
            console.log(`${urlImage} downloaded, already exists: ${counter}/${maxCounter}!`);
            continue;
        }
        else if (err.code == "ENOENT")
        {
            await limiter.RemoveTokens(1);

            try
            {
                await download.image({ url: urlImage, dest: downloadDir + folder + "\\" });
            }
            catch (error)
            {
                console.log(`${urlImage} downloaded, failed to download: ${counter}/${maxCounter} [${error}]!`);
                continue;
            }

            console.log(`> ${urlImage} downloaded, finished: ${counter}/${maxCounter}!`);
        }
        else
        {
            console.log(`${urlImage} downloaded, already exists: ${counter}/${maxCounter}!`);
        }
    }
}
