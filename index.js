const { Collection, Client, MessageEmbed, Discord } = require("discord.js");
const fs = require("fs");
const client = new Client({
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const { Player } = require("discord-player");
const player = new Player(client);
client.player = player;
const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;
const recondb = require("recondb");
client.commands = new Collection();
client.aliases = new Collection();
const Timeout = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});
client.on("ready", async () => {
  client.user.setActivity(`${prefix}help`);
  console.log(`${client.user.username} ✅`);
});
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);
});
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.id === "961765714732142663") {
    if (reaction.emoji.name === "👨") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add("955085735130726442");
      user.send("You have obtained a male role!");
    }
  }
  if (reaction.message.id === "961765714732142663") {
    if (reaction.emoji.name === "👩") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.add("955085741631868969");
      user.send("You have obtained a female role!");
    }
  }
});
client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.id === "961765714732142663") {
    if (reaction.emoji.name === "👨") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove("955085735130726442");
      user.send("Male Role Has Been Remove!");
    }
  }
  if (reaction.message.id === "961765714732142663") {
    if (reaction.emoji.name === "👩") {
      await reaction.message.guild.members.cache
        .get(user.id)
        .roles.remove("955085741631868969");
      user.send("Female Role Has Been Remove!");
    }
  }
});
client.on("guildMemberAdd", async (member) => {
  // this event gets triggered when a new member joins the server!
  // Firstly we need to define a channel
  // either using .get or .find, in this case im going to use .get()
  const Channel = member.guild.channels.cache.get("961925447837437962"); //insert channel id that you want to send to
  //making embed
  const welcome = new MessageEmbed()
    .setColor("AQUA")
    .setTitle("New Member")
    .setDescription(
      `**${member.displayName}** welcome to ${member.guild.name}, we now have ${member.guild.memberCount} members!`
    );
  // sends a message to the channel
  Channel.send(welcome);
});
client.on("guildMemberRemove", async (member) => {
  // this event gets triggered when a new member leaves the server!
  // Firstly we need to define a channel
  // either using .get or .find, in this case im going to use .get()
  const Channel = member.guild.channels.cache.get("961925447837437962"); //insert channel id that you want to send to
  //making embed
  const left = new MessageEmbed()
    .setColor("AQUA")
    .setTitle("A member left the server :(")
    .setDescription(
      `**${member.displayName}** has left ${member.guild.name}, we now have ${member.guild.memberCount} members!`
    );
  // sends a message to the channel
  Channel.send(left);
});

const usersMap = new Map();
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    console.log(difference);

    if (difference > DIFF) {
      clearTimeout(timer);
      console.log("Cleared Timeout");
      userData.msgCount = 1;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
        console.log("Removed from map.");
      }, TIME);
      usersMap.set(message.author.id, userData);
    } else {
      ++msgCount;
      if (parseInt(msgCount) === LIMIT) {
        let muterole = message.guild.roles.cache.find(
          (role) => role.name === "muted"
        );
        if (!muterole) {
          try {
            muterole = await message.guild.roles.create({
              name: "muted",
              permissions: [],
            });
            message.guild.channels.cache.forEach(async (channel, id) => {
              await channel.createOverwrite(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            });
          } catch (e) {
            console.log(e);
          }
        }
        message.member.roles.add(muterole);
        message.channel.send("You have been muted!");
        setTimeout(() => {
          message.member.roles.remove(muterole);
          message.channel.send("You have been unmuted!");
        }, TIME);
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  } else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
      console.log("Removed from map.");
    }, TIME);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn,
    });
  }
});
client.login(token);
