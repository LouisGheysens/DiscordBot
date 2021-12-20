const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./token');

let scrims = {};

class Scrim{
    constructor(message, maxPlayers){
        this.message = message;
        this.maxPlayers = maxPlayers;
        this.players = [];
    }
    addPlayer(id){
        this.players.push(id);
        this.announcePlayerCount();

        if(this.players.length === this.maxPlayers){
            this.handleFullMatch();
        }
    }

    announcePlayerCount(){
        this.message.channel.send(`There are ${this.players.length} people, omw veel mensen!!`)
    }

    handleFullMatch(){
        let teamOne = [];
        let teamTwo = [];
        let shuffledPlayer = shuffle([...this.players]);

        shuffledPlayers.forEach((player, i) =>{

            let tag = "<@" + player + ">";


            if(i % 2){
                teamOne.push(tag)
            }else{
                teamTwo.push(tag)
            }
        })

        this.message.channel.send([
            "",
            `*** SCRIM TEAMS ***`,
            `Team one: ${teamOne.join(", ")}`,
            `**VS**`,
            `Team two: ${teamTwo.join(", ")}`
        ]).then(() =>{
            this.message.edit("SCRIM FILLED!")
            delete scrims[this.message.id];
        })

    }
}

function schuffle(a){
    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg =>{
    if (msg.content.includes("documentation")){
        msg.reply([
            "It sounds like you light be looking for DOCUMENTATION",
            "Try one of the following links!:",
            "Contact Louis!"
        ])
    }
})

client.on('message', msg =>{
    if (msg.content.startsWith("+scrim")){
        let playerSlots = 4;
        let promptText = `Scrim created with ${playerSlots}`;
        msg.reply(promptText).then(botMsg =>{
            scrims[botMsg.id] = new Scrim(botMsg, playerSlots);
        });
    }
});

client.on('messageReactionAdd', async(reaction, user) =>{
    if(reaction.partial){
        try{
            await reaction.fetch()
        }catch(error){
            console.log('Something went wrong!');
            return;
        }
    }
    let scrim = scrims[reaction.message.id];
    if(scrim){
        scrims.addPlayer(user.id)
    }
});

client.login(token);

