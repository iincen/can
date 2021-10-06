// Kalau mau ngedit di message/xinz.js
"use strict";
let { WAConnection : _WAConnection } = require("@adiwajshing/baileys");
let { MessageType } = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const figlet = require("figlet");
const fs = require("fs");

const { color, bgcolor, biocolor, ArdyLog } = require("./lib/color");
const { serialize } = require("./lib/myfunc");
const myfunc = require("./lib/myfunc");
const afk = require("./lib/afk");

let WAConnection = myfunc.WAConnection(_WAConnection)

let _afk = JSON.parse(fs.readFileSync('./database/afk.json'));
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
let anticall = setting.anticall
let blocked = [];

global.xinz = new WAConnection()
xinz.mode = 'public'
xinz.baterai = {
    baterai: 0,
    cas: false
};
xinz.multi = true
xinz.nopref = false
xinz.prefa = 'anjing'
xinz.anticall = false

require('./message/Ardy.js')
nocache('./message/Ardy.js', module => console.log(color(`'${module}' Telah berubah!`)))
require('./message/help.js')
nocache('./message/help.js', module => console.log(color(`'${module}' Telah berubah!`)))

const start = async(sesion) => {
    xinz.logger.level = 'warn'
    xinz.browserDescription = ['MacOs', 'Desktop', '3.0']

    // MENG WE EM
    console.log(color(figlet.textSync('ARDY', {
		font: 'Dr Pepper',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		whitespaceBreak: false
	}), 'cyan'))
	console.log(biocolor('==========< Info >=========='))
	console.log(biocolor(`=> Creator : Ardy Ganteng`))
	console.log(biocolor(`=> Wa : 6287863200063`))
	console.log(biocolor(`=> Yt : Ardy Botz`))
	console.log(biocolor(`=> Note : Jangan Jual Belikan Sc Ini!`))

    // Menunggu QR
    xinz.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(ArdyLog('Scan QR ~~'))
    })

    // Restore Sesion
    fs.existsSync(sesion) && xinz.loadAuthInfo(sesion)

    // Mencoba menghubungkan
    xinz.on('connecting', () => {
		console.log(ArdyLog('Connecting...'))
	})

    // Konek
    xinz.on('open', (json) => {
		console.log(ArdyLog('Connect, Welcome Owner'))
	})

    // Write Sesion
    await xinz.connect({timeoutMs: 30*1000})
    fs.writeFileSync(sesion, JSON.stringify(xinz.base64EncodedAuthInfo(), null, '\t'))

    // Ya gitulah
    xinz.on('ws-close', () => {
        console.log(ArdyLog('Koneksi terputus, mencoba menghubungkan kembali..'))
    })

    // Ntahlah
    xinz.on('close', async ({ reason, isReconnecting }) => {
        console.log(ArdyLog('Terputus, Alasan :' + reason + '\nMencoba mengkoneksi ulang :' + isReconnecting))
        if (!isReconnecting) {
            console.log(ArdyLog('Connect To Phone Rejected and Shutting Down.'))
        }
    })

    // Block
    xinz.on('CB:Blocklist', json => {
        if (blocked.length > 2) return
        for (let i of json[1].blocklist) {
            blocked.push(i.replace('c.us','s.whatsapp.net'))
        }
    })

    // Action Call
    xinz.on('CB:action,,call', async json => {
        if (!xinz.anticall) return
        const callerid = json[2][0][1].from;
        xinz.sendMessage(callerid, `Maaf bot tidak menerima call`, MessageType.text)
        await xinz.blockUser(callerid, "add")
    })

    // Action Battery
    xinz.on('CB:action,,battery', json => {
        const a = json[2][0][1].value
        const b = json[2][0][1].live
        //const c = json[2][0][1].powersave
        xinz.baterai.baterai = a
        xinz.baterai.cas = b
        //xinz.baterai.powersave = c
    })

    // Chat
    xinz.on('chat-update', async (qul) => {
        // Presence
        if (qul.presences){
            for (let key in qul.presences){
                if (qul.presences[key].lastKnownPresence === "composing" || qul.presences[key].lastKnownPresence === "recording"){
                    if (afk.checkAfkUser(key, _afk)) {
                        _afk.splice(afk.getAfkPosition(key, _afk), 1)
                        fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                        xinz.sendMessage(qul.jid, `@${key.split("@")[0]} berhenti afk, dia sedang ${qul.presences[key].lastKnownPresence === "composing" ? "mengetik" : "merekam"}`, MessageType.extendedText, {contextInfo: {"mentionedJid": [key]}})
                    }
                }
            }
        }
		if (!qul.hasNewMessage) return
        qul = qul.messages.all()[0]
        if (!qul.message) return
		if (qul.key && qul.key.remoteJid == 'status@broadcast') return
        let msg = serialize(xinz, qul)
		require('./message/Ardy')(xinz, msg, blocked, _afk, welcome, left)
	})

    // Event Group 
    xinz.on('group-participants-update', async (anj) => {
        require("./message/group")(xinz, anj, welcome)
    })
}
/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
 function nocache(module, cb = () => { }) {
    console.log(color(`Module ${module} Dipantau oleh kang Bakso`))
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

start(`./${setting.sessionName}.json`)
.catch(err => console.log(err))