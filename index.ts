import Discord from "discord.js"
import ytdl from "ytdl-core"
import 'dotenv/config'


const { URL, CHANNELID, TOKEN, STATUS } = process.env
const client = new Discord.Client();

let musicas = ["https://www.youtube.com/watch?v=HRwm7uKozbg", "https://www.youtube.com/watch?v=rl127UQ72UI", "https://www.youtube.com/watch?v=-tTVJ3UIGUA", "https://www.youtube.com/watch?v=TsTtqGAxvWk", "https://www.youtube.com/watch?v=36xNGBBtMa0"];

var rand = musicas[Math.floor(Math.random() * musicas.length)];

if (!TOKEN) {
    console.error("O Token utilizado é invalido");
} else if (!CHANNELID || !Number(CHANNELID)) {
    console.error("O id do canal é invalido");
} else if (!ytdl.validateURL(musicas[0])) {
    console.error("O link da URL é invalido.");
}

let channel = null;
let broad = null;

let stream = ytdl(rand, { highWaterMark: 100 << 150,filter: 'audio'})

client.on('ready', async() => {
    client.user.setActivity(STATUS || "Radio CoffeLofi",{ type: 'LISTENING'})
    channel = client.channels.cache.get(CHANNELID) || await client.channels.fetch(CHANNELID);

    if (!channel || channel.type !== "voice") return console.error("Este canal de voz não existe")

    broad = client.voice.createBroadcast();
    stream.on('error', console.error);

    try {
    
        const connection = await channel.join();
        
        broad.play(stream);

        connection.play(broad);
        console.log("a")
        
        
        setInterval(async ()=>{   
                stream.destroy()
            
                stream = ytdl(rand, { highWaterMark: 100 << 150, filter: 'audio'});
                await broad.play(stream)
        
        }, 1500000)

    } catch (error) {
        console.error(error);
    }
  console.log("COFFE-LOFI Online!")
});

client.on('voiceStateUpdate', async userEvent => {
    if(!channel) return;
    if (userEvent.id !== client.user.id) return;
    const connection = await channel.join();
    connection.play(broad);
}) 

client.login(TOKEN)