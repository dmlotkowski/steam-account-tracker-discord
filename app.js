const SteamAPI = require('steamapi');
const steam = new SteamAPI('');
const { prefix, token } = require('./config.json');
const fs = require('fs'); //komendy w folderze
const Discord = require('discord.js')
const Embed = new Discord.RichEmbed()
var mysql = require('mysql');
const client = new Discord.Client()
client.commands = new Discord.Collection(); //komendy w folderze
client.login(token)

//MySql Connection
var connection = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

client.once('ready', () => {
    console.log('Ready!');
    var Skaner = 'SELECT Steam FROM Konta WHERE ow = false';

    function fetchSteam() {
        
        connection.query(Skaner, function (err, wiersze) {
            if (err) throw err;
            for (var wiersz of wiersze) {
                //console.log(wiersz)
                const steamId = wiersz.Steam;
               // console.log(steamId)

                steam.getUserBans(steamId).then(playerBans => {
                   //console.log(playerBans)
                    
                    if (playerBans.daysSinceLastBan == 0 && (playerBans.vacBanned == true || playerBans.gameBans >= 1)) {

                        console.log('Konto zbanowane! UPDATE from table Konta and added to Banned!');
                        connection.query('INSERT INTO Banned (Id, Steam, ban) VALUES (NULL, "' + steamId + '", true)');  
                        connection.query('UPDATE Konta SET ow = true WHERE Steam = ' + steamId + ' ')
                        steam.getUserSummary(steamId).then(summary => {

                            Embed.setColor('#8f0303')
                            Embed.setTitle('[+] User has been banned! :no_entry_sign: ')
                            Embed.setDescription('Stopped following ' + steamId + '')
                            Embed.addField('Uniform Resource Locator:', summary.url, inline = false)
                            Embed.addField('User nickname:', summary.nickname, inline = false)
                            Embed.setThumbnail(summary.avatar.medium)
                            Embed.setTimestamp()
                            Embed.setFooter('Klvrbxyz Friendship Clique', 'https://i.imgur.com/PVEHwrH.png');
                            client.channels.get(`641403440177741864`).send(Embed)
                        });
                    }

                    else if (playerBans.vacBanned == false || playerBans.gameBans == 0) {
                        console.log('Konto o numerze', steamId, 'nie ma bana');                      
                    }
                })
            }                      
        });
        
    }

    fetchSteam();
    setInterval(fetchSteam, 5500);

});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    const amount = parseInt(args[0]);

    if (!client.commands.has(commandName)) return;

    if (command.args && !args.length) {
        let reply = `You have not entered steamID or it is too short  ${message.author}!`

        if (command.usage) {
            reply += `\nKomenda powinna wygladac nastepujaco: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (command.args && isNaN(amount)) {
        let reply = 'To nie jest steamID64'

        if (command.usage) {
            reply += `\nKomenda powinna wygladac nastepujaco: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    var SteamID = require('steamid') // sprwadza czy steamid w ogole istnieje
    var sid = new SteamID('' + args + '');
    if (sid.isValid() == false) {
        let reply = `Valid Steam ID! Nicetry zoner (: !`

        if (command.usage) {
            reply += `\nKomenda powinna wygladac nastepujaco: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args, connection, Embed);
    } catch (error) {
        console.error(error);
        message.reply('Taka komenda nie istnieje!');
    }
});
