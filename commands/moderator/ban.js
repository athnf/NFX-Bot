module.exports = {
  name: "ban",
  aliases: ["b"],
  description: "Ban Members!",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const msg = await message.channel.send(`🏓 Process...`);
    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.channel.send("You Do Not Have A Permission");
    const Member = message.mentions.members.first();
    if (!Member)
      return message.channel.send("Please Mention Specific Member To Banned!");
    await Member.ban({ reason: args.slice(1).join(" ") });
    message.channel.send(
      `${Member.user.tag} was banned from NowanFX Universe!`
    );
  },
};
