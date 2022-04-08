const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "info",
  aliases: ["i"],
  description: "Info NFXBot",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const msg = await message.channel.send(`🏓 Process...`);
    const info = new MessageEmbed()
      .setTitle("NFX-Bot")
      .setAuthor("JustPrz")
      .setDescription(
        "Bot Ini Adalah Bot Private Dari Discord NowanFX Universe!"
      )
      .setColor("30AADD")
      .setFooter(
        `Request by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setThumbnail(
        "https://media.discordapp.net/attachments/945504344671924285/961534474338848828/WhatsApp_Image_2022-04-05_at_11.48.03.jpeg?width=498&height=498"
      );

    // message.channel.send()
    // message.reply()

    await message.channel.send(info);
    msg.delete();
  },
};
