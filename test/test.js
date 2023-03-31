require('dotenv').config();
const { Webhook, MessageBuilder } = require('../src');

const { WEBHOOK_URL } = process.env;

const hook = new Webhook(WEBHOOK_URL);

const IMAGE_URL = 'https://remywiki.com/images/2/26/Rouge_no_dengon_jb.png';

hook.setUsername('Webhook API integration test');
hook.setAvatar(IMAGE_URL);

describe('Custom hooks', function(){
    it('Sends embed', function(done){
        const embed = new MessageBuilder();

        embed.setText('Text')
        .setAuthor('Discord Webhook Node Author', IMAGE_URL, 'https://npmjs.org/package/discord-webhook-node')
        .setTitle('Title')
        .setURL('https://npmjs.org/package/discord-webhook-node')
        .setImage(IMAGE_URL)
        .setThumbnail(IMAGE_URL)
        .setColor('#00b0f4')
        .addField('Field #1', 'Not inline')
        .setDescription('Description')
        .setFooter('Footer', IMAGE_URL)
        .setTimestamp();

        hook.send(embed).then(() => {
            done();
        })
        .catch(err => done(err));
    });

    it('Sends text to webhook', function(done){
        hook.send('Plain text').then(() => {
            done();
        })
        .catch(err => done(err));
    });
});