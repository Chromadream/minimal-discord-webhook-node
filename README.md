# Minimal Discord Webhook API for NodeJS

A fork of [discord-webhook-node-data](https://www.npmjs.com/package/discord-webhook-node-data), but without `fs` requirement to support Cloudflare Workers (without any node compatibility flag) and potentially other FaaS providers.

- [Installation](#installation)
- [Examples](#examples)
    - [Basic use](#basic-use)
    - [Custom embeds](#custom-embeds)
    - [Custom settings](#custom-settings)
- [Notes](#notes)
- [API](#api)
    - [Webhook](#webhook---class)
    - [MessageBuilder](#messagebuilder---class)
- [License](#license)

# Installation
```npm install minimal-discord-webhook-node``` or ```yarn add minimal-discord-webhook-node```

# Examples

## Basic use
```js
const { Webhook } = require('minimal-discord-webhook-node');
const hook = new Webhook("YOUR WEBHOOK URL");

const IMAGE_URL = 'https://remywiki.com/images/2/26/Rouge_no_dengon_jb.png';
hook.setUsername('Discord Webhook Node Name');
hook.setAvatar(IMAGE_URL);

hook.send("Hello there!");
```

## Custom embeds
```js
const { Webhook, MessageBuilder } = require('minimal-discord-webhook-node');
const hook = new Webhook("YOUR WEBHOOK URL");

const embed = new MessageBuilder()
.setTitle('My title here')
.setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
.setURL('https://www.google.com')
.addField('First field', 'this is inline', true)
.addField('Second field', 'this is not inline')
.setColor('#00b0f4')
.setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
.setDescription('Oh look a description :)')
.setImage('https://cdn.discordapp.com/embed/avatars/0.png')
.setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
.setTimestamp();

hook.send(embed);
```

Keep in mind that the custom embed method `setColor` takes in a decimal color/a hex color (pure black and white hex colors will be innacurate). You can convert hex colors to decimal using this website here: [https://convertingcolors.com](https://convertingcolors.com)


## Custom settings
```js
const { Webhook } = require('minimal-discord-webhook-node');
const hook = new Webhook({
    url: "YOUR WEBHOOK URL",
    //If throwErrors is set to false, no errors will be thrown if there is an error sending
    throwErrors: false,
    //retryOnLimit gives you the option to not attempt to send the message again if rate limited
    retryOnLimit: false
});

hook.setUsername('Username'); //Overrides the default webhook username
hook.setAvatar('YOUR_AVATAR_URL'); //Overrides the default webhook avatar
```

# Notes
discord-webhook-node is a promise based library, which means you can use `.catch`, `.then`, and `await`, although if successful will not return any values. For example:

```js
const { Webhook } = require('minimal-discord-webhook-node');
const hook = new Webhook("YOUR WEBHOOK URL");

hook.send("Hello there!")
.then(() => console.log('Sent webhook successfully!'))
.catch(err => console.log(err.message));
```

or using async:
```js
const { Webhook } = require('minimal-discord-webhook-node');
const hook = new Webhook("YOUR WEBHOOK URL");

(async () => {
    try {
        await hook.send('Hello there!');
        console.log('Successfully sent webhook!');
    }
    catch(e){
        console.log(e.message);
    };
})();
```

By default, it will handle Discord's rate limiting, and if there is an error sending the message (other than rate limiting), an error will be thrown. You can change these options with the custom settings options below.

# API
## Webhook - class
Constructor
- options (optional) : object
    - throwErrors (optional) : boolean
    - retryOnLimit (optional) : boolean

Methods
- setUsername(username : string) returns this
- setAvatar(avatarURL : string (image url)) returns this
- async send(payload : string/MessageBuilder)

## MessageBuilder - class
Methods
- setText(text: string)
- setAuthor(author: string (text), authorImage (optional) : string (image url), authorUrl (optional) : string (link))
- setTitle(title: string)
- setURL(url: string)
- setThumbnail(thumbnail : string (image url))
- setImage(image : string (image url))
- setTimestamp(date (optional) number/date object)
- setColor(color : string/number (hex or decimal color))
- setDescription(description : string)
- addField(fieldName : string, fieldValue: string, inline (optional) : boolean)
- setFooter(footer : string, footerImage (optional) : string (image url))

# License

MIT