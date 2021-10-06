"use strict";
const {
	MessageType,
	Presence
} = require("@adiwajshing/baileys");
const fs = require("fs");

const { getBuffer, sleep } = require("../lib/myfunc");

let setting = JSON.parse(fs.readFileSync('./config.json'));
let { botName } = setting

module.exports = async(Ardy, anj, welcome) => {
    const isWelcome = welcome.includes(anj.jid)
    const mdata = await Ardy.groupMetadata(anj.jid)
    const groupName = mdata.subject

    if (anj.action === 'add'){
        if (anj.participants[0] === Ardy.user.jid){
            await sleep(5000)
            Ardy.updatePresence(anj.jid, Presence.composing)
            Ardy.sendMessage(anj.jid, `Hai aku ${botName}, silahkan kirim #menu`, MessageType.text)
        } else if (isWelcome){
            try {
                var pic = await Ardy.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            try {
                var pic_gc = await Ardy.getProfilePicture(anj.jid)
            } catch {
                var pic_gc = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            let bufferrr = await getBuffer(`https://ardy.herokuapp.com/api/maker/welcome?name=${anj.participants[0].split("@")[0]}&namegrp=${groupName}&member=@Ardy&picbg=https://i.ibb.co/t2TmNZ1/Ardy.jpg&picurl=${pic}&imggrp=${pic_gc}`)
            Ardy.sendMessage(anj.jid, bufferrr, MessageType.image, {caption: `Hai @${anj.participants[0].split("@")[0]}, selamat datang di ${groupName}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
        }
    } else if (anj.action === 'remove'){
        try {
            var pic = await Ardy.getProfilePicture(anj.participants[0])
        } catch {
            var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
        }
        Ardy.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `Sayonara @${anj.participants[0].split("@")[0]}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
    } else if (anj.announce == false) {
      var opengc = `「 *Group Opened* 」\n\nGroup Telah Dibuka Oleh Admin\n_Sekarang Semua Member Bisa Mengirim Pesan_`
      Ardy.sendMessage(anj.jid, opengc, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: `0@s.whatsapp.net` }, message: { groupInviteMessage: { groupJid: "62816566217-1617422360@g.us", inviteCode: "EiznDZqIWu40QPVO0Q9MVn", groupName: "𝐀𝐍𝐈𝐌𝐄 𝐋𝐎𝐕𝐄𝐑𝐒 𝐈𝐍𝐃𝐎𝐍𝐄𝐒𝐈𝐀", caption: "*YTEAM BOTZ*Create By : *Vid*", 'jpegThumbnail': fs.readFileSync('./media/Ardy.jpg')} } }})
      console.log(`- [ Group Setting Change ] - In ${groupName}`)
    } else if (anj.announce == true ) {
      var closegc = `Test Doank Dulu, [ Close Gc ]`
      Ardy.sendMessage(anj.jid, opengc, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: `0@s.whatsapp.net` }, message: { groupInviteMessage: { groupJid: "62816566217-1617422360@g.us", inviteCode: "EiznDZqIWu40QPVO0Q9MVn", groupName: "𝐀𝐍𝐈𝐌𝐄 𝐋𝐎𝐕𝐄𝐑𝐒 𝐈𝐍𝐃𝐎𝐍𝐄𝐒𝐈𝐀", caption: "*YTEAM BOTZ*Create By : *Vid*", 'jpegThumbnail': fs.readFileSync('./media/Ardy.jpg')} } }})
    }
}