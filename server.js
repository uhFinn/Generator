const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const bot = new Discord.Client({disableEveryone: true});
const http = require('http');
const request = require('request');
const fs = require('fs');
const express = require('express');
const app = express();
const ms = require('ms')
let storage = require("./storage.json")
let disable = require("./disabled.json")
let slowmode = require("./slowmode.json")
let pref = require("./prefix.json")
let stats = require("./stats.json")
let prem = require("./premium.json")
let ban = require("./bans.json")
let set = require("./settings.json")
let premcodes = require("./premcodes.json")
let token = require("./token.json")
let serverban = require("./serverban.json")
const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3NTI2MTI3MDcxMTMzNjk2MSIsImJvdCI6dHJ1ZSwiaWF0IjoxNTM2NDE5NzgyfQ.8WcPfu-J0BSNnMPowEunk7Ihe6w3RrTxh52Ff63A0tM', client);
const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

let slow = require("./slow.json")

// Optional events
dbl.on('posted', () => {
  console.log('Server count posted!');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})

const server = http.createServer(app);
const debl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ3NTI2MTI3MDcxMTMzNjk2MSIsImJvdCI6dHJ1ZSwiaWF0IjoxNTM2NDE5NzgyfQ.8WcPfu-J0BSNnMPowEunk7Ihe6w3RrTxh52Ff63A0tM', { webhookAuth: 'password', webhookServer: server });
debl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
debl.webhook.on('vote', vote => {
  console.log(`User with ID ${vote.user} just voted!`);
});

dbl.getVotes().then(votes => {
    console.log(votes)
});



let gtnChannel = ""
let gtnHeight = 0
let gtnActive = false


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

client.on("ready", async () => {

  let guildino = client.guilds.cache.map(guild => guild.id)
  var eee
  for(eee = 0; eee < guildino.length; eee++){
    client.guilds.cache.get(guildino[eee]).members.fetch()
  }


  dbl.postStats(client.guilds.cache.size);
  setInterval(() => {
    dbl.postStats(client.guilds.cache.size);
  }, 1800000);

  client.user.setActivity("Starting Bot..", {
    type: "PLAYING",
    name: "Starting Bot.."
  });


var ehh
for(ehh = 0; ehh < slow.full.length; ehh++){
  let ide = slow.full[ehh][0]
  slow[ide] = {
    nils: []
  }
  console.log("Wiped " + ide)
  fs.writeFile("./slow.json", JSON.stringify(slow), (err) => {
    if(err) console.log(err)
  });
}

setTimeout(function(){
  slow.full = []
  fs.writeFile("./slow.json", JSON.stringify(slow), (err) => {
    if(err) console.log(err)
  });
  console.log("Wiped full")
}, ms("0.5s"));



  setInterval(backup, 15000);

  function backup( )
  {
    if(storage["475265399613685771"] && storage["593889836922961923"] && storage["715687159419371592"]){
      fs.copyFile('./storage.json', './storagebackup.json', (err) => {
        if (err) throw err;
        console.log('Backup Created');
      });
    }
  }

  setInterval(status, 60000);

  function status( )
  {
      client.user.setActivity(`${client.guilds.cache.size.toLocaleString()} Servers`, {
        type: "WATCHING",
        name: `${client.guilds.cache.size} Servers`
      });
    setTimeout(function(){
        client.user.setActivity(`${client.users.cache.size.toLocaleString()} Users`, {
          type: "WATCHING",
          name: `${client.users.cache.size} Users`
        });
      setTimeout(function(){
          client.user.setActivity(`!help`, {
            type: "LISTENING",
            name: `!help`
          });
          setTimeout(function(){
            client.user.setActivity(`${stats.items} Items Generated`, {
              type: "PLAYING",
              name: `${stats.items} Items Generated`
            });
            setTimeout(function(){
              client.user.setActivity(`${stats.stocked} Items Stocked`, {
                type: "PLAYING",
                name: `${stats.stocked} Items Stocked`
              });
            }, ms("12s"));
          }, ms("12s"));
      }, ms("12s"));
    }, ms("12s"));
  }

  
})

client.on("message", async message => {

if(message.guild != null){

if(!storage[message.guild.id]){
  storage[message.guild.id] = {
    nils: []
  };
} 
  fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
  if(err) console.log(err)
}); 



if(!slowmode[message.guild.id]){
  slowmode[message.guild.id] = {
    nils: []
  };
} 
  fs.writeFile("./slowmode.json", JSON.stringify(slowmode), (err) => {
  if(err) console.log(err)
});

if(!slow[message.guild.id]){
  slow[message.guild.id] = {
    nils: []
  };
} 
  fs.writeFile("./slow.json", JSON.stringify(slow), (err) => {
  if(err) console.log(err)
});

  
  
  if(!pref[message.guild.id]) {
        pref[message.guild.id] = {
            prefix: "!"
        };
    }
    fs.writeFile("./prefix.json", JSON.stringify(pref), (err) => {
        if (err) console.log(err)
    });

    if(!prem[message.guild.id]) {
        prem[message.guild.id] = {
            active: false,
            dayend: 0
        };
    }
    fs.writeFile("./premium.json", JSON.stringify(prem), (err) => {
        if (err) console.log(err)
    });


    if(!set[message.guild.id]) {
        set[message.guild.id] = {
            underitem: false,
            selfdestruct: true           
        };
    }
    fs.writeFile("./settings.json", JSON.stringify(set), (err) => {
        if (err) console.log(err)
    });

    if(!serverban[message.guild.id]) {
      serverban[message.guild.id] = {
          list: []      
      };
  }
  fs.writeFile("./serverban.json", JSON.stringify(serverban), (err) => {
      if (err) console.log(err)
  });

if(message.channel.id == "738853715208831086"){
  //unchecked
  //let unchecked2 = require("./stocknstuff/unchecked.json")
  //let unchecked1 = unchecked2.list
  //let unchecked0 = Math.round(Math.random() * unchecked1.length)
  //let unchecked = unchecked1[unchecked0]
  //
  message.embeds.forEach((embed) => {
       let desc = embed.description
       let id1 = desc.split(":")
        console.log(id1)
        let id0 = id1[2].split(")")
        console.log(id0)
        let idd = id0[0]
        console.log(idd)
        let rng = Math.round(Math.random() * 999 + 1)
        console.log(rng)

        let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting For Generator")
            .setColor("#f01800")
            .setThumbnail("https://media.discordapp.net/attachments/626860095195709444/735536567543922778/download.png?width=169&height=169")
            .setDescription("Our team are working on providing you with rewards for voting, These will come very soon!")
            .setFooter("Have a great day!")

        client.users.cache.get(idd).send(emb)

        /*
        if(rng < 500){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#f01800")
            .setDescription("Sadly you didnt win a prize this time, but maybe tommorow\nGood Luck!")

          client.users.cache.get(idd).send(emb)
        } else if(rng >= 500 && rng < 900){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#38f54e")
            .setDescription(`You won a unchecked nitro code\n${unchecked}`)

          client.users.cache.get(idd).send(emb)
        } else if(rng >= 900 && rng < 940){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#38f54e")
            .setDescription("You won an alpha star code")

          client.users.cache.get(idd).send(emb)
        } else if(rng >= 940 && rng < 980){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#38f54e")
            .setDescription("You won a pulsar code")

          client.users.cache.get(idd).send(emb)
      } else if(rng >= 980 && rng < 995){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#38f54e")
            .setDescription("You won a steam code")

          client.users.cache.get(idd).send(emb)
      } else if(rng >= 995 && rng < 1000){
          let emb = new Discord.MessageEmbed()
            .setTitle("Thanks For Voting")
            .setColor("#38f54e")
            .setDescription("You won a month of generator premium")

          client.users.cache.get(idd).send(emb)
      }
      */
  });
} 

 if(message.channel.id == "735549696864550924"){
   if(message.author.id == "695664615534755850" || message.author.id == "265536498529599490"){

    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let lengi = charset.length
    let code = `${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}-${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}-${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}${charset[Math.round(Math.random() * lengi)]}`

     let argi = message.content.split("|")
     if(argi[1] == "ban"){
      ban.bans.push(argi[0])
      message.channel.send("Banned!")
      client.users.cache.get(argi[0]).send("***You Have Been Banned!***\nChargebacks are strictly prohibited by us at Generator\nWe will be fighting against the chargeback case\nYou have also been prohibited from ever using generator commands in any server\nThis decision is final and permanent.")
      fs.writeFile("./bans.json", JSON.stringify(ban), (err) => {
        if (err) console.log(err)
      });
     } else if(argi[1] == "a"){
       message.channel.send("Processed! :)")
       client.users.cache.get(argi[0]).send(`***Congratulations! Your Payment Was Successful***\nWe have received and processed your payment and are pleased to say that it went well\nTo activate the one month premium token in any server go to the server of choice and use the following command:\n\`\`\`!boost ${code}\`\`\`\nAfter that your chosen server will benefit from 30 days of premium perks!\n**Thank you for your purchase, Enjoy!**`)
       let today = new Date();
       let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
       premcodes.list.push(code)
       fs.writeFile("./premcodes.json", JSON.stringify(premcodes), (err) => {
        if(err) console.log(err)
       });
     } else if(argi[1] == "b"){
       message.channel.send("Processed! :(")
       client.users.cache.get(argi[0]).send("***Aww, Were sad to see you go***\nWe noticed you cancelled your monthly subscription with us,\nIt is a shame but we hope to see you again in the future\n**Have a great day!**")
       let today = new Date();
       let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
     }
   }
 }


 
  
  let prefix = pref[message.guild.id].prefix

  /*
  if(message.mentions.members.first()){
  let mentionee = message.mentions.members.first() || message.guild.members.get(message.content);

  if(mentionee.id == "475261270711336961"){
    let emb = new Discord.MessageEmbed()
      .setTitle("Server Prefix")
      .setDescription(`Your current prefix for this server is set to: \`${prefix}\``)
      .setFooter(`If you need further assistance please type: ${prefix}help`)

    message.channel.send(emb)
  }
  }
  */

  const users = client.users.size
  const servers = client.guilds.size
  if(message.author.bot) return;
  if(message.content.indexOf(pref[message.guild.id].prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //if(message.author.id != "265536498529599490") return message.channel.send("Generator is down for 30 minutes, Updating slowmode system\nSorry for the inconveniance")

  if(!slow[message.guild.id][message.channel.id]){
    let donee = false
    var i
    for(i = 0; i < slow.full.length; i++){
      if(slow.full[i][0] == message.guild.id){
        slow.full[i][1].push(message.channel.id)
        donee = true
      }
    }
    setTimeout(function(){
    if(donee == false){
      slow.full.push([message.guild.id, [message.channel.id]])
    }
    slow[message.guild.id][message.channel.id] = []

    fs.writeFile("./slow.json", JSON.stringify(slow), (err) => {
      if(err) console.log(err)
    });

    }, ms("0.05s"));
  }

  if(ban.bans.includes(message.author.id)) return
  if(serverban[message.guild.id].list.includes(message.author.id)) return message.channel.send("You have been banned from using generator commands in this server!")
  

  if(command == "stock"){
    let log = storage[message.guild.id].nils
    let amt = log.length
    let stringi = ""
    let stockometer = ""
    let totaly0 = 0
    let totaly
    if(log.length == 0){
          return message.channel.send(`Your server does not have any stock!\nTo add some do !restock [item] [value]`)
      }

    let lim = "1,000"

    if(prem[message.guild.id].active == true){
      lim = "75,000"
    }

    var i
    for (i = 0; i < log.length; i++) {
        console.log(i)
        let data = storage[message.guild.id][log[i]]
        let len = data.length
        totaly0 = totaly0 + len
        if(len > 0){
        stringi = `${stringi}\n\`${log[i]}\`  -  **${len}** in stock!`
      } 
      
    }
    
    setTimeout(function(){
      
    if(totaly0 < 20){
      stockometer = "🔴━━━━"
    } else if(totaly0 < 50){
      stockometer = "━🔴━━━"
    } else if(totaly0 < 100){
      stockometer = "━━🟡━━"
    } else if(totaly0 < 150){
      stockometer = "━━━🟢━"
    } else {
      stockometer = "━━━━🔵"
    }

    if(totaly0 != 0){
      totaly = totaly0.toLocaleString()
    } else {
      totaly = totaly0
    }

    if(stringi == ""){
        stringi = "This server does not have any stock!\nTo add some do !restock [item] [value]"
    }

    let emb = new Discord.MessageEmbed()
    .setTitle("Stock")
    .setColor("RANDOM")
    .addField("-----------", `${stringi}`)
    .setFooter(`Total Stock: ${totaly}/${lim}\nStock Level: ${stockometer}`)

    message.channel.send(emb)
}, ms("0.1s"));

  }

  if(command == "restock"){
    let log = storage[message.guild.id].nils
    var i
    let totaly = 0
    for (i = 0; i < log.length; i++) {
        console.log(i)
        let data = storage[message.guild.id][log[i]]
        let len = data.length
        totaly = totaly + len
    }
    let lim = 1000
    if(prem[message.guild.id].active == true) lim = 75000
    let nd = 0

    let left = lim - totaly
    if(left <= 0) return message.channel.send(`Standard members can only stock 1,000 items at a time\nUpgrade to premium to get 75,000 item slots!\n\`For more info type: ${prefix}premium\`\n**You can also unstock items with ${prefix}unstock [Type]**`)

    if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "265536498529599490") return message.channel.send("Only server admins can do this!")
      let type0 = args[0]
      let type = type0.toUpperCase()
      let art = 0
      if(!log.includes(type)){
        log.push(type)
      }

      if(message.attachments.first()){//checks if an attachment is sent
        if(!storage[message.guild.id][type]){
        storage[message.guild.id][type] = []
        fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
          if(err) console.log(err)
        });
      }
        console.log("Attach")
        let filename1 = message.attachments.first().name
        console.log(filename1)
        let filename0 = filename1.split(".")
        console.log(filename0)
        let filename = filename0[filename0.length - 1]
        console.log(filename)
        if(filename == "txt"){//Download only png (customize this)
            console.log("txt")
            download(message.attachments.first().url);//Function I will show later
            setTimeout(function(){
              fs.readFile('temporary.txt', (err, data) => { 
                if (err) throw err; 
  
                let full = data.toString()
                let leny = full.split("\n") 
                message.channel.send(`Reading file, This will take ${leny.length * 12}ms`)
                let ee = null
                ee = setInterval(inti, 10);
                var ie = 0
                function inti( )
                {
                  ie = ie + 1
                  if((ie) > leny.length){
                    clearInterval(ee)
                    message.channel.send(`Restocked ${art}X \`${type}\`'s`)
                  }
                  if(left >= 1){
                  let curlist = storage[message.guild.id][type]
                  if(leny[ie]){
                  if(leny[ie] != ""){
                  curlist.push(leny[ie])
                  art = art + 1
                  left = left - 1
                  let curst = stats.stocked
                  stats.stocked = curst + 1
                  fs.writeFile("./stats.json", JSON.stringify(stats), (err) => {
                    if(err) console.log(err)
                  });
                  fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
            if(err) console.log(err)
          });
                  }
                  }
                } else {
                  clearInterval(ee)
                  message.channel.send(`Restocked ${art}X \`${type}\`'s\nMissing ${leny.length - art} due to hitting storage limit, Type \`${prefix}premium\` to unlock more storage!\n**You can also unstock items with ${prefix}unstock [Type]**`)
                }
              }
              }) //message.channel.send(`Restocked ${art}X \`${type}\`'s`)
            }, ms("2s"));
        } else return message.channel.send("Invalid file type!\nPlease use a `.txt` file instead")
    } else {
      

      let amount = args.length
      let downward = message.content.split("\n").join(" ").split(" ")
      console.log(downward)
      let downamount = downward.length
      let fullamt = downamount + (amount - 1)
      console.log(fullamt)

      if(amount + downamount > 500) return message.channel.send("You can not restock more than 500 items at a time")
      if(!storage[message.guild.id][type]){
      storage[message.guild.id][type] = []
      fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
  if(err) console.log(err)
});
      }

      if(downward.length == 1){
        console.log("straight")
      var i
      for (i = 1; i < amount; i++) {
        if(left >= 0){
        let curlist = storage[message.guild.id][type]
        curlist.push(args[i])
        art = art + 1
        left = left - 1
        console.log(args[i])
        let curst = stats.stocked
        stats.stocked = curst + 1
        fs.writeFile("./stats.json", JSON.stringify(stats), (err) => {
          if(err) console.log(err)
        });
        fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
  if(err) console.log(err)
});
      } else {
        nd = nd + 1
      }
    }
    } else {
      console.log("down")
      var i
      for (i = 2; i < downward.length; i++) {
        if(left >= 1){
        let curlist = storage[message.guild.id][type]
        curlist.push(downward[i])
        art = art + 1
        left = left - 1
        console.log(downward[i])
        let curst = stats.stocked
        stats.stocked = curst + 1
        fs.writeFile("./stats.json", JSON.stringify(stats), (err) => {
          if(err) console.log(err)
        });
        fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
          if(err) console.log(err)
        });
      } else {
        nd = nd + 1
      }
    }
    }

      setTimeout(function(){
        if(nd > 0){
          message.channel.send(`Restocked ${art}X \`${type}\`'s\nMissing ${nd} items due to hitting storage limit, Type \`${prefix}premium\` to unlock more storage!\n**You can also unstock items with ${prefix}unstock [Type]**`)
        } else {
          message.channel.send(`Restocked ${art}X \`${type}\`'s`)
        }
      }, ms("0.5s"));
    }
  }

  if(command == "gen" || command == "generate"){

    if(!slow[message.guild.id]){
      console.log("Noslow")
    } else {
      if(!slow[message.guild.id][message.channel.id]) slow[message.guild.id][message.channel.id] = []
      if(slow[message.guild.id][message.channel.id].includes(message.author.id)){
        if(slowmode[message.guild.id][message.channel.id]){
          return message.channel.send(`Wait ${slowmode[message.guild.id][message.channel.id]} Before using this command again!`)
        } else {
          return message.channel.send(`Wait 5 seconds Before using this command again!`)
        }
      }
    }
      
    let liste = disable["fulllistcausewhynot"].channels
    if(liste.includes(message.channel.id)) return message.channel.send("This channel is disabled!")
    let type0 = args[0]
    if(!type0) return message.channel.send("Please specify an item to generate, eg !gen nitro")
    let type = type0.toUpperCase()
    if(!storage[message.guild.id][type]) return message.channel.send(`There are no \`${type}\`'s in stock`)
    let amt0 = storage[message.guild.id][type]
    let amt = amt0.length
    if(amt == 0) return message.channel.send(`There are no \`${type}\`'s in stock`)
    let list = storage[message.guild.id][type]
    let varr = list[0]
    list.shift()
    fs.writeFile("./storage.json", JSON.stringify(storage), (err) => {
  if(err) console.log(err)
})

    let curamtt = stats.items
    stats.items = curamtt + 1
    fs.writeFile("./stats.json", JSON.stringify(stats), (err) => {
  if(err) console.log(err)
})

    if(set[message.guild.id].underitem == false){
      if(set[message.guild.id].selfdestruct == true){
      let emb = new Discord.MessageEmbed()
      .setTitle(`Generated 1X \`${type}\` from \`${message.guild.name}\``)
      .setColor("RANDOM")
      .addField("-------------------------------------------", `Item:\n${varr}`)
      .setFooter("❗ This message will delete itself in 5 minutes ❗")

      let pen = await message.author.send(emb)

      let yesemb = new Discord.MessageEmbed()
      .setTitle(`✅ I have DM'd you 1x ${type}!`)
      .setColor("#51d624")

      message.channel.send(yesemb)

      setTimeout(function(){
        pen.delete()
      }, ms("5m"))
      
      if(!slowmode[message.guild.id]){
        slowmode[message.guild.id] = {
          nils: [],
        }

        slowmode[message.guild.id][message.channel.id] = []
      }
      slow[message.guild.id][message.channel.id].push(message.author.id);
        if(slowmode[message.guild.id][message.channel.id]){
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms(slowmode[message.guild.id][message.channel.id]));
        } else {
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms("5s"));
        }
      } else {
        let emb = new Discord.MessageEmbed()
      .setTitle(`Generated 1X \`${type}\` from \`${message.guild.name}\``)
      .setColor("RANDOM")
      .addField("-------------------------------------------", `Item:\n${varr}`)

      let pen = await message.author.send(emb)

      let yesemb = new Discord.MessageEmbed()
      .setTitle(`✅ I have DM'd you 1x ${type}!`)
      .setColor("#51d624")

      message.channel.send(yesemb)
      

      if(!slowmode[message.guild.id]){
        slowmode[message.guild.id] = {
          nils: [],
        }

        slowmode[message.guild.id][message.channel.id] = []
      }
      slow[message.guild.id][message.channel.id].push(message.author.id);
        if(slowmode[message.guild.id][message.channel.id]){
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms(slowmode[message.guild.id][message.channel.id]));
        } else {
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms("5s"));
        }
      }
    } else {
      if(set[message.guild.id].selfdestruct == true){
      let emb = new Discord.MessageEmbed()
      .setTitle(`Generated 1X \`${type}\` from \`${message.guild.name}\``)
      .setColor("RANDOM")
      .setFooter("❗ This message will delete itself in 5 minutes ❗")

      let pen = await message.author.send(emb)
      let den = await message.author.send(`${varr}`)

      let yesemb = new Discord.MessageEmbed()
      .setTitle(`✅ I have DM'd you 1x ${type}!`)
      .setColor("#51d624")

      message.channel.send(yesemb)

      setTimeout(function(){
        pen.delete()
        den.delete()
      }, ms("5m"))

      if(!slowmode[message.guild.id]){
        slowmode[message.guild.id] = {
          nils: [],
        }

        slowmode[message.guild.id][message.channel.id] = []
      }
      slow[message.guild.id][message.channel.id].push(message.author.id);
        if(slowmode[message.guild.id][message.channel.id]){
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms(slowmode[message.guild.id][message.channel.id]));
        } else {
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms("5s"));
        }
      } else {
        let emb = new Discord.MessageEmbed()
      .setTitle(`Generated 1X \`${type}\` from \`${message.guild.name}\``)
      .setColor("RANDOM")

      let pen = await message.author.send(emb)
      let den = await message.author.send(`${varr}`)

      let yesemb = new Discord.MessageEmbed()
      .setTitle(`✅ I have DM'd you 1x ${type}!`)
      .setColor("#51d624")

      message.channel.send(yesemb)

      if(!slowmode[message.guild.id]){
        slowmode[message.guild.id] = {
          nils: [],
        }

        slowmode[message.guild.id][message.channel.id] = []
      }
      slow[message.guild.id][message.channel.id].push(message.author.id);
        if(slowmode[message.guild.id][message.channel.id]){
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms(slowmode[message.guild.id][message.channel.id]));
        } else {
          setTimeout(() => {
            slow[message.guild.id][message.channel.id].remove(message.author.id);
          }, ms("5s"));
        }
      }
    }


  }

  if(command == "prefix"){

  }

  if(command == "invite"){

    let emb = new Discord.MessageEmbed()
    .setTitle("**Generator** Invite")
    .setColor("RANDOM")
    .setThumbnail("https://media.discordapp.net/attachments/626860095195709444/735536567543922778/download.png?width=169&height=169")
    .addField("Add Generator To Your Server!", "https://discordapp.com/oauth2/authorize?client_id=475261270711336961&scope=bot&permissions=8")
    .setFooter("Generator", client.user.avatarURL)

    message.channel.send(emb)

  }

  if(command == "help"){
    let type
    if(args[0]){
        type = args[0].toLowerCase()
    }
    if(type == "general"){
      let emb = new Discord.MessageEmbed()
        .setTitle("General Commands")
        .setColor("#483eb5")
        .setThumbnail("https://cdn.discordapp.com/avatars/475261270711336961/64a7dc8e9fcccc65f7ddace59bda80d3.png?size=128")
        .addField(`\`${prefix}\`gen`, "Generate an item from the servers stock")
        .addField(`\`${prefix}\`stock`, "Check the servers current stock levels")
        .addField(`\`${prefix}\`support`, "Join our support server")
        .addField(`\`${prefix}\`premium`, "Get info on generator premium")
        .setFooter("Generator • Command List")

    message.channel.send(emb)
    } else if(type == "setup"){
      let emb = new Discord.MessageEmbed()
        .setTitle("Setup Commands")
        .setColor("#483eb5")
        .setThumbnail("https://cdn.discordapp.com/avatars/475261270711336961/64a7dc8e9fcccc65f7ddace59bda80d3.png?size=128")
        .addField(`\`${prefix}\`restock`, "Restock an item, Format: `restock [Type] (Item1) (Item2) Etc`\nThis also accepts downwards lists and attaching text files")
        .addField(`\`${prefix}\`unstock`, "Unstock a singular item or a full category")
        .addField(`\`${prefix}\`disableall`, "Disable All Channels")
        .addField(`\`${prefix}\`enableall`, "Enable all channels")
        .addField(`\`${prefix}\`disable`, "Disable tagged or id'd channel")
        .addField(`\`${prefix}\`enable`, "Enable tagged or id'd channel")
        .addField(`\`${prefix}\`slowmode`, "Add a custom slowmode to a channel")
        .setFooter("Generator • Command List")

    message.channel.send(emb)
    } else if(type == "other"){
      message.channel.send("Other command list coming soon")
    } else if(type == "faq"){
      let emb = new Discord.MessageEmbed()
        .setTitle("Setup Commands")
        .setColor("#483eb5")
        .setThumbnail("https://cdn.discordapp.com/avatars/475261270711336961/64a7dc8e9fcccc65f7ddace59bda80d3.png?size=128")
        .addField("What is this bot?", "Generator is a bot that allows server owners to add stock to their server, this stock can then be generated by users in decided channels with decided delays/slowmodes")
        .addField("Okay, So how do I use it?", `To get a full list of commands do ${prefix}help`)
        .addField("In what ways can I add stock", "Adding stock is simple and can be done in 3 ways, some are tedious but the others were implemented to make your life easier, Option 1:\n`!restock [Type] (Item1) (Item2)` ETC\n\nOption 2:\n`!restock [Type] (Item1)\n(Item2)`\nETC\n\nOption 3:\n`!restock [Type]\n[Attach .txt file]`")
        .addField("And how do I generate these items", `Easy, All you have to do is type \`${prefix}gen [Type]\``)
        .setFooter("FAQ will be updated soon")

    message.channel.send(emb)
    } else {
      let emb = new Discord.MessageEmbed()
          .setTitle("Generator Commands")
          .setColor("#483eb5")
          .setThumbnail("https://cdn.discordapp.com/avatars/475261270711336961/64a7dc8e9fcccc65f7ddace59bda80d3.png?size=128")
          .addField("General Commands", `Use \`${prefix}help general\` to access a list of general commands`)
          .addField("Setup Commands", `Use \`${prefix}help setup\` to access a list of setup commands`)
          .addField("Other Commands", `Use \`${prefix}help other\` to access a list of other commands`)
          .addField("**FAQ**", `Use \`${prefix}-help faq\` to see a list of frequently asked questions`)
          .setFooter("Generator • Command List")

      message.channel.send(emb)
    }
  }

  if(command == "unstock"){
    if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != '265536498529599490') return message.channel.send("Only server admins can do this!")
    let type0 = args[0]
    let type = type0.toUpperCase()
    if(!args[1]){

    if(!storage[message.guild.id][type]) return message.channel.send("None of those are in stock!")
    storage[message.guild.id][type] = []
    message.channel.send(`I have unstocked ${type}'s`)
    } else {
      let val = args[1]
      let full = storage[message.guild.id][type]
      if(!full.includes(val)) return message.channel.send("That exact item is not in stock")
      full.remove(val)
      message.channel.send(`I have unstocked your specified item from \`${type}\`'s`)
    }
  }

  if(command == "support"){
    message.channel.send("**Our Official Support Server**\nhttps://discord.gg/Ynw48Xz")
  }

  if(command == "say"){
    let reasonie = args.slice(0).join(" ");
    message.channel.send(reasonie)
    message.delete()
  }

  if(command == "disable"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only server admins can do this!")
    if(!args[0]) return message.reply("Please specify a channel to disable")
    let chanid = args[0].replace(/\D/g,'')
    if(!chanid) return
    let list = disable["fulllistcausewhynot"].channels
    if(list.includes(chanid)) return message.reply("That channel is already disabled!")
    list.push(chanid)
    message.channel.send(`I have disabled <#${chanid}>!`)

    fs.writeFile("./disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
  }

  if(command == "enable"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only server admins can do this!")
    if(!args[0]) return message.reply("Please specify a channel to disable")
    let chanid = args[0].replace(/\D/g,'')
    if(!chanid) return
    let list = disable["fulllistcausewhynot"].channels
    if(!list.includes(chanid)) return message.reply("That channel is already enabled!")
    list.remove(chanid)
    message.channel.send(`I have enabled <#${chanid}>!`)

    fs.writeFile("./disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
  }

  if(command == "disableall"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only server admins can do this!")
    let list = disable["fulllistcausewhynot"].channels
    let string = "The following channels:\n"
    message.guild.channels.cache.forEach(channel => { 
    if(channel.type == 'text'){
    if(!list.includes(channel.id)){
    list.push(channel.id);
    }
    string = `${string}<#${channel.id}>, `
    }
  });
    
    let m = await message.channel.send("Disabling all channels, One moment please")

    setTimeout(function(){
      string = `${string}\nHave been disabled!`
      message.channel.send(string)

      fs.writeFile("./disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
    }, ms("2s"));
  }

  if(command == "enableall"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only server admins can do this!")
    let list = disable["fulllistcausewhynot"].channels
    let string = "The following channels:\n"
    message.guild.channels.cache.forEach(channel => { 
    if(channel.type == 'text'){
    if(list.includes(channel.id)){
    list.remove(channel.id);
    }
    string = `${string}<#${channel.id}>, `
    }
  });
    
    let m = await message.channel.send("Enabling all channels, One moment please")

    setTimeout(function(){
      string = `${string}\nHave been enabled!`
      message.channel.send(string)

      fs.writeFile("./disabled.json", JSON.stringify(disable), (err) => {
  if(err) console.log(err)
});
    }, ms("2s"));
  }

  if(command == "slowmode" || command == "cooldown"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only server admins can do this!")
    let channel = args[0].replace(/\D/g,'')
    let time = args[1]

    if(ms(time) > ms("6h")){
      if(prem[message.guild.id].active == false) return message.channel.send(`Slowmodes can only be up to 6 hours long,\nTo upgrade this to 24 hours purchase premium, For more info type: \`${prefix}premium\``)
    }
    if(ms(time) > ms("24h")) return message.channel.send("The premium server slowmode limit is 24 hours, Sorry!")

    if(!channel) return
    if(!time) return

    if(slowmode[message.guild.id][channel]){
      slowmode[message.guild.id][channel] = time
      message.channel.send(`Added a ${time} slowmode to <#${channel}>`)
    } else {
      slowmode[message.guild.id][channel] = time
      message.channel.send(`Added a ${time} slowmode to <#${channel}>`)
    }
  }

  if(command == "autodrop"){

  }

  if(command == "stats"){
    let curusers = client.users.cache.size
    let curservers = client.guilds.cache.size
    let amount
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`

    let emb = new Discord.MessageEmbed()
      .setTitle("Generator Stats")
      .setColor("RANDOM")
      .setDescription(`**Servers**  -  ${curservers}\n**Users**  -  ${curusers}\n**Shard**  -  1/1\n**Uptime**  -  ${uptime}\n**Items Generated**  -  ${stats.items}\n**Items Stocked**  -  ${stats.stocked}`)

    message.channel.send(emb)
  }

  if(command == "vote"){
    let emb = new Discord.MessageEmbed()
    .setTitle("  Vote For The Bot\nAnd get amazing rewards!")
    .setColor("RANDOM")
    .setDescription("\n**50% Chance**  -  Nothing\n**40% Chance**  -  Unchecked Nitro Code\n**4% Chance**  -  Alpha Star Game\n**4% Chance**  -  Hex Run Game\n**2% Chance**  -  Random Steam Key")

    message.channel.send(emb)

    setTimeout(function(){
          message.channel.send("Vote Link:\n**https://top.gg/bot/475261270711336961/vote**")
      }, ms("0.5s"));

  }


  if(command == "premium"){
    let emb = new Discord.MessageEmbed()
      .setTitle("Get Generator Premium")
      .setColor("#f078f0")
      .setThumbnail("https://media.discordapp.net/attachments/739777896750776423/740267731424641104/download_4.png?width=120&height=120")
      .addField("**How much is Generator Premium?**", "Generator premium costs $1.99 per month, \n*Less than a cup of coffee!*")
      .addField("**What does Generator Premium give?**", "- **Increased** stock __[75,000 Items]__\n- **Increased Slowmode** *[Slowmode can be up to 24 hours]*\n- **Custom** Server Prefix\n- **24/7** Support\n\n[[Purchase Here!]](https://generator.tebex.io/)")

    message.channel.send(emb)
  }

  if(command === "eval"){
 function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}  
  let arg = message.content.split(" ").slice(1);
    if(message.author.id !== "265536498529599490") return
    try {
      let code = arg.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      message.channel.send(clean(evaled), {code:"xl"});
      console.log(`Done: ${code} return: good`)
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      console.log("error with eval")
    }
  }

  if(command == "boost"){
    var today = new Date();
    const firstDate = new Date(2000, 1, 1);
    const secondDate = new Date(today.getFullYear(), (today.getMonth()+1), today.getDate());
    const diffdays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    let code = args[0]
    if(code == "check"){
      if(prem[message.guild.id].active == true){
        let emb = new Discord.MessageEmbed()
          .setTitle("Remaining Boost Days")
          .setDescription(`${message.guild.name} has **${prem[message.guild.id].dayend - diffdays}** days left of Generator premium perks!`)
          .setFooter(`Need More?\nPurchase with: ${prefix}premium`)

        return message.channel.send(emb)
      } else {
        return message.channel.send(`***Hmm..***\nIt seems this server doesnt have an active boost subscription, Feel free to purchase one with \`${prefix}premium\``)
      }
    }
    if(!args[0]) return message.channel.send(`***Oops!***\nPlease specify the code for boosting, it will have been dm'd to you on purchase!\nEG: \`${prefix}boost XXXX-XXXX-XXXX\`\n\nIf you dont have a boost code feel free to purchase one here: ${prefix}premium`)

    if(premcodes.list.includes(code)){
      premcodes.list.remove(code)
      fs.writeFile("./premcodes.json", JSON.stringify(premcodes), (err) => {
        if (err) console.log(err)
      });
      let stringser = ""
      if(prem[message.guild.id].dayend < diffdays){
        stringser = "Your one month server boost code was applied successfully,\nThis server now benefits from: 75,000 storage limit, Up to 24 hour slowmode, Custom prefix" //\n**For info on how to use premium perks type +help premium**
        prem[message.guild.id].dayend = diffdays + 30
        prem[message.guild.id].active = true
        prem.full.push(message.guild.id)
        fs.writeFile("./premium.json", JSON.stringify(prem), (err) => {
          if (err) console.log(err)
        });
      } else {
        stringser = "Your server already had an active premium token so we've gone ahead and added the extra month on to the current total!"
        let curry = prem[message.guild.id].dayend
        prem[message.guild.id].dayend = curry + 30
        prem[message.guild.id].active = true
        fs.writeFile("./premium.json", JSON.stringify(prem), (err) => {
          if (err) console.log(err)
        });
      }

      let emb = new Discord.MessageEmbed()
        .setTitle("***Congrats!***")
        .setColor("#f078f0")
        .setThumbnail("https://media.discordapp.net/attachments/739777896750776423/740267731424641104/download_4.png?width=120&height=120")
        .setDescription(stringser)
        .setFooter(`To check your remaining boost days for this server type: ${prefix}boost check`)

      message.channel.send(emb)

      premcodes.list.remove(code)
      fs.writeFile("./premcodes.json", JSON.stringify(premcodes), (err) => {
        if (err) console.log(err)
      });

        
    } else {
      return message.channel.send(`***Uhh..***\nThat doesnt seem to be a valid code!\nIf you believe this is an issue please contact a staff at: ${prefix}support`)
    }
  }
  
  if(command == "settings"){
    if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != '265536498529599490') return message.channel.send("Only server admins can do this!")
    let setting0 = args[0]
    let value0 = args[1]
    let setting
    let value
    let emb = new Discord.MessageEmbed()
      .setTitle(`${message.guild.name}'s Settings`)
      .setColor("#327ba8")
      .setDescription(`Below are your server settings, to change any do ${prefix}settings [Setting] [Value]\nFor Example: ${prefix}settings underitem true`)
      .addField(`**UnderItem:** ${set[message.guild.id].underitem}`, "UnderItem setting allows you to displays the item generated underneath the embed, this is useful for discord game or nitro codes as it allows the user to instantly click the claim button")
      .addField(`**SelfDestruct:** ${set[message.guild.id].selfdestruct}`, "This setting allows you to toggle whether generated items get deleted after 5 minutes, by default this is true")
      .addField(`**Prefix:** ${prefix}`, "**[Premium Feature]**\nWith this you can change your servers bot prefix, by default its ! youu require Generator premium to change this, to purchase premium type !premium")
      .setFooter("More Settings Coming Soon!")
    if(args[0]){
      setting = setting0.toLowerCase()
    } else {
      return message.channel.send(emb)
    }
    if(args[1]){
      value = value0.toLowerCase()
    } else {
      return message.channel.send(emb)
    }

    if(setting == "underitem"){
      if(value == "true"){
        if(set[message.guild.id].underitem == true) return message.channel.send("**underitem** is already set to true")
        set[message.guild.id].underitem = true
        message.channel.send(`Set **underitem** setting to true`)
        fs.writeFile("./settings.json", JSON.stringify(set), (err) => {
          if (err) console.log(err)
        });
      } else if(value == "false"){
        if(set[message.guild.id].underitem == false) return message.channel.send("**underitem** is already set to false")
        set[message.guild.id].underitem = false
        message.channel.send(`Set **underitem** setting to false`)
        fs.writeFile("./settings.json", JSON.stringify(set), (err) => {
          if (err) console.log(err)
        });
      } else {
        return message.channel.send(`That is an invalid value, Please do:\n\`${prefix}settings ${setting} true/false\``)
      }
    } else if(setting == "prefix"){
      if(prem[message.guild.id].active == false) return message.channel.send("You need premium to us this feature, type `!premium` to unlock these features")
      if(args[2]) return message.channel.send("Prefixes can not contain space marks")
      if(pref[message.guild.id].prefix == value0) return message.channel.send(`Your server prefix is already ${value0}`)
      pref[message.guild.id].prefix = value0
      fs.writeFile("./prefix.json", JSON.stringify(pref), (err) => {
        if (err) console.log(err)
      });
      message.channel.send(`Successfully set prefix to: \`${value0}\``)
    } else if(setting == "selfdestruct"){
      if(value == "true"){
        if(set[message.guild.id].selfdestruct == true) return message.channel.send("**selfdestruct** is already set to true")
        set[message.guild.id].selfdestruct = true
        message.channel.send(`Set **selfdestruct** setting to true`)
        fs.writeFile("./settings.json", JSON.stringify(set), (err) => {
          if (err) console.log(err)
        });
      } else if(value == "false"){
        if(set[message.guild.id].selfdestruct == false) return message.channel.send("**selfdestruct** is already set to false")
        set[message.guild.id].selfdestruct = false
        message.channel.send(`Set **selfdestruct** setting to false`)
        fs.writeFile("./settings.json", JSON.stringify(set), (err) => {
          if (err) console.log(err)
        });
      } else {
        return message.channel.send(`That is an invalid value, Please do:\n\`${prefix}settings ${setting} true/false\``)
      }
    }
  }

if(command == "ban"){
  if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "265536498529599490") return message.channel.send("Only server admins can do this!")
  if(!args[0]){
    let list = serverban[message.guild.id].list
    string = ""
    var b
    for(b = 0; b < list.length; b++){
      string = `${string}${list[b]}\n`
    }
    setTimeout(function(){
      message.channel.send(`**List of ${list.length} banned User ID's in this server:**\n${string}`)
    }, ms("0.5s"));
  }
  let mentionee = message.mentions.members.first() || message.guild.members.get(message.content);
  if(serverban[message.guild.id].list.includes(mentionee.id)) return message.channel.send(`This user is already banned, to unban them type: \`${prefix}unban @user\``)
  serverban[message.guild.id].list.push(mentionee.id)

  message.channel.send(`I have blocked <@${mentionee.id}> from using Generator commands in this server!`)
}

if(command == "unban"){
  if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "265536498529599490") return message.channel.send("Only server admins can do this!")
  if(!args[0]){
    let list = serverban[message.guild.id].list
    string = ""
    var b
    for(b = 0; b < list.length; b++){
      string = `${string}${list[b]}\n`
    }
    setTimeout(function(){
      if(string == "") string = `No banned users in this server!\nTo ban someone type: \`${prefix}ban @user\``
      message.channel.send(`**List of ${list.length} banned User ID's in this server:**\n${string}`)
    }, ms("0.5s"));
  }
  let mentionee = message.mentions.members.first() || message.guild.members.get(message.content);
  if(!serverban[message.guild.id].list.includes(mentionee.id)) return message.channel.send(`This user is not banned, to ban them type: \`${prefix}ban @user\``)
  serverban[message.guild.id].list.remove(mentionee.id)

  message.channel.send(`I have unblocked <@${mentionee.id}> from using Generator commands in this server!`)
}






}
})

function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream('temporary.txt'));
}

client.login(token.token)