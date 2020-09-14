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

export async function DoDownloadsAsync(limiter: TsLimiter.ITsLimiter, imageList, folder): Promise<void>
{
    var counter = 0;
    var maxCounter = imageList.length;
    fs.mkdir(downloadDir + folder + "\\",
        (err) =>
        {
            if (err)
            {
                if (err.code != 'EEXIST')
                    throw `mkdir failed: ${err}`;
            }
        });

    for (var index in imageList)
    {
        counter++;
        var i = imageList[index];

        var fileName = i.split("/")[i.split("/").length - 1];
        var fullPath = downloadDir + folder + "\\" + fileName;
        var err = null;

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
            console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
            continue;
        }
        else if (err.code == "ENOENT")
        {
            await limiter.RemoveTokens(1);
            let filename = null;

            try
            {
                filename = await download
                    .image({ url: i, dest: downloadDir + folder + "\\" });
            }
            catch (error)
            {
                console.log(`${i} downloaded, failed to download: ${counter}/${maxCounter} [${error}]!`);
                continue;
            }

            console.log(`> ${i} downloaded, finished: ${counter}/${maxCounter}!`);
        }
        else
        {
            console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
        }
    }
}

export async function StartDownloads(limiter: TsLimiter.ITsLimiter, imageList, folder): Promise<void>
{
    return await DoDownloadsAsync(limiter, imageList, folder);
}

