require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

const issues = [];

const API_URL = 'https://gitcoin.co/api/v0.1/bounties?is_open=true';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('NTIxOTMwOTIxMDYzMDg4MTQ4.DvDoyQ.et6nDk7Ptbo3EObw5Z1RNpnHKMU');
