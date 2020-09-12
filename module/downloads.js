const snekfetch = require("snekfetch")
const Promise = require("promise")
const fs = require("fs");
const rateLimiter = require('limiter').RateLimiter
const limiter = new rateLimiter(1,1000);

const download = require('image-downloader');
const downloadDir = process.cwd()+"\\downloads\\";

function startDownloads(imageList, folder)
{
    return new Promise((resolve, reject) =>
                       {
                           var counter = 1;
                           var maxCounter = imageList.length;
                           fs.mkdir(downloadDir + folder + "\\", (err) => {
                               if (err) {
                                   if (err.code != 'EEXIST')
                                       reject(err);
                               }
                           })
                           imageList.map((i, index) => {
                               var fileName = i.split("/")[i.split("/").length - 1];
                               var fullPath = downloadDir + folder + "\\" + fileName;
                               fs.stat(fullPath, (err, stat) => {
                                   if (err == null) {
                                       console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
                                       counter++;
                                       if (counter == maxCounter) {
                                           resolve();
                                       }
                                   }
                                   else if (err.code == "ENOENT") {
                                       limiter.removeTokens(1, () => {
                                           download
                                           .image({ url: i, dest: downloadDir + folder + "\\" })
                                           .then((filename) => {
                                               console.log(`> ${i} downloaded, finished: ${counter}/${maxCounter}!`);
                                               counter++;
                                               if (counter == maxCounter) {
                                                   resolve();
                                               }
                                           })
                                           .catch((error)=>{
                                               console.log(`${i} downloaded, failed to download: ${counter}/${maxCounter} [${error}]!`);
                                               counter++;
                                               if (counter == maxCounter) {
                                                   resolve();
                                               }
                                           });
                                       })
                                   }
                                   else {
                                       console.log(`${i} downloaded, already exists: ${counter}/${maxCounter}!`);
                                       counter++;
                                       if (counter == maxCounter) {
                                           resolve();
                                       }
                                   }
                               })
                           })
                       })
}


module.exports.startDownloads = startDownloads
    