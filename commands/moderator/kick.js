module.exports = {
  name: "kick",
  aliases: ["k"],
  description: "Kick Members!",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const msg = await message.channel.send(`🏓 Process...`);
    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.channel.send("You Do Not Have A Permission");
    const Member = message.mentions.members.first();
    if (!Member)
      return message.channel.send("Please Mention Specific Member To Kick!");
    await Member.kick({ reason: args.slice(1).join(" ") });
    message.channel.send(
      `${Member.user.tag} was kicked from NowanFX Universe!`
    );
  },
};
