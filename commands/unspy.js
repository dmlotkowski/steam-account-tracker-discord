module.exports = {
    name: 'unspy',
    description: 'unTracking',
    args: true,
    usage: '<steamid>',
    execute(message, args, connection, Embed) {

        Embed.setColor('#00d5ff')
        Embed.setTitle('[-] Operation successful!')
        Embed.setDescription('Stopped following ID: ' + args + '')
        Embed.setFooter('Klvrbxyz Friendship Clique', 'https://i.imgur.com/PVEHwrH.png');
        Embed.setTimestamp()
        message.channel.send(Embed);
        
        connection.query('DELETE FROM Konta WHERE Steam = ' + args + '');
    },
}; 