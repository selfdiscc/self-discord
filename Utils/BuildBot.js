const axios = require('axios');
const event = require("events");
const discc = new event.EventEmitter();

 class BuildBot {
    constructor(token) {
        this.token = token;
    }
    async create(name) {
        if(!this.token) return console.error("Please Provide a token.");
        if(!name) return console.error("Please provide a name");

        const request = await axios({
            url: 'https://discord.com/api/v9/applications',
            method: "POST",
            headers: {
                Authorization: this.token
            },
            "content-type": "application/json",
            data: {
                name: name
            }
        });
        let data = request.data;
        axios({
            url: `https://discord.com/api/v9/applications/${data.id}/bot`,
            method: "POST",
            headers: {
                Authorization: this.token
            },
            "content-type": "application/json"
        }).then(() => {
            axios({
                url: `https://discord.com/api/v9/applications/${data.id}/bot/reset`,
                method: 'POST',
                headers: {
                    Authorization: this.token
                },
                "content-type": "application/json"
            }).then((res) => {
                setTimeout(() => {
                    discc.emit('GetBotToken', res.data)
                }, 2000)
            })
        })
    }
}
module.exports = {BuildBot, discc};
