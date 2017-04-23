var readline = require("readline");

var authenticate = require("./module/authenticate"),
    guilds       = require("./module/guilds"),
    messages     = require("./module/messages"),
    downloads    = require("./module/downloads");

var userGuilds = [],
    savedServerId = "",
    savedChannelName = "",
    images = [],
    lastMessage = "";

var readl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var readLine = ((question)=>{
  return new Promise((resolve, reject)=>{
    readl.question(question, (answer)=>{
      resolve(answer);
    })
  })
})

var login = ()=>{
  readLine("> Username:").then((username)=>{
    readLine("> Password:").then((password)=>{
      authenticate.authenticate(username, password)
      .then((token)=>{
        console.log(`> Login successful!`);
        //console.log(`> Login successful! Token:${token}`);
        displayServers(token);
      }).catch((error)=>{
        console.log(`> Login unsuccessful!`);
        login();
      })
    })
  })
}

var displayServers = (token)=>{
  guilds.getGuilds(token)
  .then((results)=>{
    var userGuilds = results;
    for(i in userGuilds){
      console.log(`[${i}] - ${results[i].name}`);
    }
    readLine(`> Which server do you want to download? [0-${results.length-1}]\n`).then((serverIndex)=>{
      if(serverIndex >= 0 && serverIndex < results.length){
        savedServerId = userGuilds[serverIndex].id;
        displayChannels(token, userGuilds[serverIndex].id);
      }else{
        //Recursion
        //displayServers(token);
      }
    });
  })
  .catch((error)=>{
    console.error(`Error retrieving guild list!`);
    console.log(error);
    //Possibly crash out or retry.
  })
}

var displayChannels = (token, serverid)=>{
  console.log('\033[2J');
  guilds.getGuildChannels(token, serverid)
  .then((channels)=>{
    for(c in channels){
      console.log(`[${c}] - ${channels[c].name}`);
    }
    readLine(`> What channel do you want to download from? [0-${channels.length-1}]\n`).then((channelIndex)=>{
      if(channelIndex >= 0 && channelIndex < channels.length){
        savedChannelName = channels[channelIndex].name;
        images = [];
        lastMessage = "";
        fetchImages(token, channels[channelIndex].id ,channels[channelIndex].last_message_id);
      }
    })
  })
  .catch((error)=>{
    console.log(error);
  })
}
var loops = 0;
var fetchImages = (token, channelid, channellastmessage)=>{
  loops++;
  messages.getChannelMessages(token, channelid, lastMessage, false, 100)
  .then((messageRes)=>{
    if(messageRes.code == 50001){
      console.error("> You lack the permission to access this channel!");
      displayChannels(token, savedServerId)
    }
    if(messageRes.length >0){
      lastMessage = messageRes[messageRes.length-1].id;
      for(m in messageRes){
        for(a in messageRes[m].attachments){
          var url = messageRes[m].attachments[a].url;
          images.push(url)
        } 
      }
      if(/*images.length <= 50 |*/ messageRes.length > 0){
        fetchImages(token,channelid,lastMessage);
      }else{
        downloadImages(token);
      }
    }else{
      downloadImages(token);
    }
  })
  .catch((error)=>{
    console.log(error)
  })
}

var downloadImages = (token)=>{
    readLine(`> ${images.length} images in found, proceed to download? [Y/N]\n`).then((response)=>{
      if(response == "y" | response == "Y"){
        console.log("> Downloading!")
        downloads.startDownloads(images,savedChannelName).then(()=>{
          console.log("> All images downloaded, back to channel list!")
          setTimeout(()=>{displayChannels(token, savedServerId)},1000)
        })
      }else{
       setTimeout(()=>{displayChannels(token, savedServerId)},1000)
      }
    })
}
login();