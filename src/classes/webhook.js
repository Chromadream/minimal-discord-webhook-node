const { sendWebhook } = require('../api');

module.exports = class Webhook {
    constructor(options){
        this.payload = {};

        if (typeof options == 'string'){
            this.hookURL = options;
            this.throwErrors = true;
            this.retryOnLimit = true;
        }
        else {
            this.hookURL = options.url;
            this.throwErrors = options.throwErrors == undefined ? true : options.throwErrors;
            this.retryOnLimit = options.retryOnLimit == undefined ? true : options.retryOnLimit;
        };
    };

    setUsername(username){
        this.payload.username = username;

        return this;
    }

    setAvatar(avatarURL){
        this.payload.avatar_url = avatarURL;

        return this;
    }

    async send(payload){
        let endPayload = {
            ...this.payload
        };

        if (typeof payload === 'string'){
            endPayload.content = payload;
        }
        else {
            endPayload = {
                ...endPayload,
                ...payload.getJSON()
            };
        };

        try {
            const res = await sendWebhook(this.hookURL, endPayload);

            if (res.status == 429 && this.retryOnLimit){
                const body = await res.json();
                const waitUntil = body["retry_after"];

                setTimeout(() => sendWebhook(this.hookURL, endPayload), waitUntil);
            }
            else if (res.status != 204){
                throw new Error(`Error sending webhook: ${res.status} status code. Response: ${await res.text()}`);
            };
        }
        catch(err){
            if (this.throwErrors) throw new Error(err.message);
        };
    };
};
