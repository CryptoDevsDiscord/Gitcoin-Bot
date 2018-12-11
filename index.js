require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const client = new Discord.Client();

let issues;
let newIssues;
let lastFetch;

const API_URL = 'https://gitcoin.co/api/v0.1/bounties?is_open=true';

const createEmbed = (issue) => {
  const expire = new Date(issue.expires_date);
  return {
    embed: {
      color: 2418840,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL,
      },
      title: issue.title,
      url: issue.url,
      fields: [
        {
          name: 'Difficulty',
          value: issue.experience_level,
        },
        {
          name: 'Keywords',
          value: issue.keywords,
        },
        {
          name: 'Reward',
          value: `$${issue.value_in_usdt}`,
        },
        {
          name: 'Expires',
          value: `${expire.getMonth()}/${expire.getDate()}/${expire.getFullYear()}${
            issue.can_submit_after_expiration_date ? ' (Can submit after expiration)' : ''
          }`,
        },
      ],
      footer: {
        icon_url: client.user.avatarURL,
        text: 'Powered by Gitcoin',
      },
    },
  };
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  axios
    .get(API_URL)
    .then((result) => {
      issues = Object.values(result.data);
      const channel = client.channels.get('435685690936786946');
      channel.send(createEmbed(issues[0]));
      client.setInterval(() => {
        const channel = client.channels.get('435685690936786946');
        channel.sendMessage('beep beep');
      }, 20 * (1000 * 60));
      return true;
    })
    .catch(console.log);
});

client.login(process.env.BOT_TOKEN);
