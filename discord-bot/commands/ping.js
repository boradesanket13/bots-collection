module.exports = {
    name: 'ping',
    aliases: ['hello'],
    description: 'Returns a pong when pinged',
    execute(message, args) {
        message.channel.send('Pong!');
    },
};
