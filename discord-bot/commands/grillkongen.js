module.exports = {
  name: "grillkonge",
  aliases: ["gk", "grillkongen"],
  description: "Poster et bilde av selveste grillkongen",
  execute(message, args) {
    const food = ["pølser", "hamburger", "ostepølse", "stek"];
    let randomFood = food[Math.floor(Math.random() * food.length)];
    message.channel.send(`Nam nam, jeg lukter ${randomFood}!`, {
      files: ["./images/grillkongen.png"],
    });
  },
};
