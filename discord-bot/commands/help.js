const prefix = process.env.CMD_PREFIX;

module.exports = {
  name: "help",
  description: "List all of my commands or get info about a specific command.",
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 10,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    // Did they ask for help with a specific command?
    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(
        commands
          .map(
            (command) => `${prefix}${command.name}  \`${command.description}\``
          )
          .join("\n")
      );
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      return message.reply(data, { split: true });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
  },
};
