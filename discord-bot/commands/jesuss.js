module.exports = {
  name: "jesuss",
  aliases: ["jesus"],
  description: "Poster et bilde av vår frelser",
  execute(message, args) {
    message.channel.send("Se, vår frelser!", {
      files: ["./images/jesuss.png"],
    });
  },
};
