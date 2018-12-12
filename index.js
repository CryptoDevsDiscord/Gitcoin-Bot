require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const client = new Discord.Client();

let issues;
let oldIssues;
let lastFetch;

const titles = [];

const API_URL = 'https://gitcoin.co/api/v0.1/bounties?is_open=true&order_by=-web3_created&network' +
    '=mainnet';

const createEmbed = (issue) => {
  const expire = new Date(issue.expires_date);
  const reward = `${issue.value_true} ${issue.token_name} ${
  issue.value_in_usdt
    ? `($${issue.value_in_usdt})`
    : ''}`;

  const fields = [];
  if (issue.experience_level) {
    fields.push({name: 'Difficulty', value: issue.experience_level});
  }
  if (issue.keywords) {
    fields.push({name: 'Keywords', value: issue.keywords});
  }
  fields.push({
    name: 'Reward',
    value: reward
  }, {
    name: 'Expires',
    value: `${expire.getMonth()}/${expire.getDate()}/${expire.getFullYear()}${issue.can_submit_after_expiration_date
      ? ' (Can submit after expiration)'
      : ''}`
  });

  return {
    embed: {
      color: 2418840,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: issue.title,
      url: issue.url,
      fields,
      footer: {
        icon_url: client.user.avatarURL,
        text: 'Powered by Gitcoin'
      }
    }
  };
};

// TODO rewrite so it checks the message history and doesn't post duplicates
const getNewIssues = () => {
  axios
    .get(API_URL)
    .then((result) => {
      issues = Object.values(result.data);
      issues = issues
        .slice(0, 16)
        .filter(issue => !titles.includes(issue.title));
      issues.reverse();
      const newIssues = issues.filter(issue => !oldIssues.includes(issue));
      console.log("Pushed new issues");
      const gitcoinChannel = client
        .channels
        .get(process.env.GITCOIN_CHANNEL);
      issues.forEach((issue) => {
        console.log(createEmbed(issue));
        gitcoinChannel.send(createEmbed(issue));
      });
      oldIssues = issues;
      return true;
    });
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const gitcoinChannel = client
    .channels
    .get(process.env.GITCOIN_CHANNEL);
  gitcoinChannel
    .fetchMessages()
    .then(msg => {
      const ids = msg.map(msg => msg.id);
      ids.forEach(id => gitcoinChannel.fetchMessage(id).then(msg => titles.push(msg.embeds[0].title)))
    })
    .catch(console.error);
  axios
    .get(API_URL)
    .then((result) => {
      issues = Object
        .values(result.data)
        .slice(0, 16);
      issues.reverse();
      const channel = client
        .channels
        .get(process.env.GITCOIN_CHANNEL);
      issues
        .filter(issue => !titles.includes(issue.title))
        .forEach(issue => {
          console.log(createEmbed(issue).embed.fields)
          channel.send(createEmbed(issue))
        });
      oldIssues = issues;
      client.setInterval(getNewIssues, 20 * (1000 * 60));
      return true;
    })
    .catch(console.log);
});

client.login(process.env.BOT_TOKEN);
