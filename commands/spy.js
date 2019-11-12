module.exports = {
    name: 'spy',
    description: 'tracking',
    args: true,
    usage: '<steamid>',
    execute(message, args, connection, Embed) {

        connection.query('INSERT INTO Konta (Id, Steam, ow) VALUES (NULL, "' + args + '", false)', (err) => {
            if (err) {
                Embed.setColor('#e5ff00')
                Embed.setTitle('[!!] Operation Interrupted!')
                Embed.setDescription('The account already exists in the database ID: ' + args + '')
                Embed.setFooter('Klvrbxyz Friendship Clique', 'https://i.imgur.com/PVEHwrH.png');
                Embed.setTimestamp()
                message.channel.send(Embed);
            }

            else {
                Embed.setColor('#00ff51')
                Embed.setTitle('[+] Operation successful!')
                Embed.setDescription('Started following ID: ' + args + '')
                Embed.setFooter('Klvrbxyz Friendship Clique', 'https://i.imgur.com/PVEHwrH.png');
                Embed.setTimestamp()
                message.channel.send(Embed);
            }
        });
                         
    },
};