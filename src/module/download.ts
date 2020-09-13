import * as TsLimiter from './tsLimiter';
import fetch from 'cross-fetch';
import * as fs from 'fs';

const download = require('image-downloader');
const downloadDir = process.cwd() + "\\downloads\\";

export function DoDownloadsAsync(limiter: TsLimiter.ITsLimiter, imageList, folder, resolve, reject)
{
    var counter = 1;
    var maxCounter = imageList.length;
    fs.mkdir(downloadDir + folder + "\\", (err) =>
    {
        if (err)
        {
            if (err.code != 'EEXIST')
                reject(err);
        }
    })
    imageList.map((i, index) =>
    {
        var fileName = i.split("/")[i.split("/").length - 1];
        var fullPath = downloadDir + folder + "\\" + fileName;
        fs.stat(fullPath, async (err, stat) =>
        {
            if (err == null)
            {
                console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
                counter++;
                if (counter == maxCounter)
                {
                    resolve();
                }
            }
            else if (err.code == "ENOENT")
            {
                await limiter.RemoveTokens(1);
                download
                    .image({ url: i, dest: downloadDir + folder + "\\" })
                    .then((filename) =>
                    {
                        console.log(`> ${i} downloaded, finished: ${counter}/${maxCounter}!`);
                        counter++;
                        if (counter == maxCounter)
                        {
                            resolve();
                        }
                    })
                    .catch((error) =>
                    {
                        console.log(`${i} downloaded, failed to download: ${counter}/${maxCounter} [${error}]!`);
                        counter++;
                        if (counter == maxCounter)
                        {
                            resolve();
                        }
                    });
            }
            else
            {
                console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
                counter++;
                if (counter == maxCounter)
                {
                    resolve();
                }
            }
        })
    })
}

export async function StartDownloads(limiter: TsLimiter.ITsLimiter, imageList, folder): Promise<void>
{
    return new Promise((resolve, reject) => { DoDownloadsAsync(limiter, imageList, folder, resolve, reject) });
}

