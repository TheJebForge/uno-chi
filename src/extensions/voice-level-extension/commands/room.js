const { MessageEmbed } = require('discord.js');

function createRoom(message, args) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');
    
    if (!args.id) return;
    if (!args.exp) return;

    let room_id = args.id[0];
    let experience = args.exp[0];
    let mining = args.mining ? args.mining[0] : 0;

    if (!message.guild.channels.resolve(room_id)) return;
    if (isNaN(experience)) return;


    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    room.settings.experience = experience;

    if (!isNaN(mining[0])) {
        room.settings.mining = mining;
    }
    
    voiceRoomExtension.save(room);
    voiceRoomExtension.saveLocal(room);


}

function getRoomInfo(message, args, overage) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');

    let room_id = overage[0];
    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    if (room.isTemplate) return;
    let channel = message.guild.channels.resolve(room.room_id);

    let memberCount = channel.members.filter(member => !member.bot).size;
    let embed = new MessageEmbed();
    let stats = '';
    stats += `Посетителей: ${memberCount}\n`;
    stats += `XP в ${core.configuration.voice_tick} секунд: ${room.settings.experience}\n`;
    embed.setColor("#580ad6")
        .setTitle(`Информация о голосовой комнате "${channel.name}"`)
        .addField('Посетителей', memberCount, true)
        .addField(`XP в ${core.configuration.voice_tick} секунд`, room.settings.experience, true);
        
    if (room.settings.mining) {
        embed.addField(`Выпекаининг`, room.settings.mining, true);
    }

    message.channel.send(embed);
}

function removeRoom(message, args, overage) {
    const voiceRoomExtension = core.getExtension('VoiceRoomExtension');

    let room_id = overage[0];
    let room = voiceRoomExtension.findVoiceRoom(message.guild.id, room_id);
    if (room.isTemplate) return;

    voiceRoomExtension.delete(room);
}

let remove = {
    slug: 'remove',
    execute: removeRoom,
}

let info = {
    slug: 'info',
    execute: getRoomInfo,
}

let create = {
    slug: 'create',
    execute: createRoom,
}

let command = {
    slug: 'room',
    childrens: [ create, info, remove ],
}

module.exports = command;