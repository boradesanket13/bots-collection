const fs = require("fs");
const Discord = require("discord.js");
const fetch = require("node-fetch");

require("dotenv").config();

const prefix = process.env.CMD_PREFIX;
const token = process.env.TOKEN;
const ver = process.env.NODE_ENV;

console.log(`Current prefix: ${prefix}`);
console.log(`Current environment: ${ver}\n`);

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

// We only want the actual command files
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Make a set of commands to make them easier to handle
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Let's us know that we are ready
bot.once("ready", () => {
  console.info(`Connected as ${bot.user.tag}`);

  if (ver == "production") {
    bot.user.setActivity("Meget oppegående bot", {
      type: "STREAMING",
      url: "https://twitch.tv/lasagnegutten",
    });
  } else {
    bot.user.setActivity("I kode-land", { type: "PLAYING" });
  }
});

// Whenever there is a message, check if it is a command
bot.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Parse the command
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Let's keep a log of commands
  console.info(`User ${message.author.tag} called command: ${commandName}`);

  // Let's see if it is a command or an alias for one
  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // If it's not a command, do nothing
  if (!command) {
    message.reply(` sorry! Unknown command \`${commandName}\``);
    return console.info(`Unknown command ${commandName}`);
  }

  // Check if we can execute the command in DMs
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check if we need and/or have arguments
  if (command.args && !args.length) {
    let reply = `You didn't provide any awguments, ${message.author}`;

    // Let's be helpful and describe how to use the command
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // How about we handle some cooldowns?
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(
      `oopsie, I did a fucky wucky trying to execute ${commandName}, sowwyy`
    );
  }
});

bot.login(token);
