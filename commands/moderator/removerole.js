const { Message } = require("discord.js");

module.exports = {
  name: "removerole",
  aliases: ["rmrole"],
  run: async (client, message, args) => {
    // param
    /**
     * @param {Message} message
     */
    // permission
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel.send("You Do Not Have Permission!");
    // var
    const target = message.mentions.members.first(); // mentions = member
    if (!target) return message.channel.send("No Spesific Member!");
    const role = message.mentions.roles.first(); // mentions = role
    if (!role) return message.channel.send("No Spesific Role!");
    // code
    await target.roles.remove(role); // add role to user
    message.channel.send(`${target.user.username} roles has been remove!`);
  },
};
