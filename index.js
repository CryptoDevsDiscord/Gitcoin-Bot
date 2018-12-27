require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const client = new Discord.Client();

let issues;
let oldIssues;
let lastFetch;

let titles = [];

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
  if (issue.attached_job_description) {
    fields.push({name: 'Hiring', value: issue.attached_job_description});
  }
  fields.push({
    name: 'Reward',
    value: reward
  }, {
    name: 'Expires',
    value: `${expire.getMonth() + 1}/${expire.getDate()}/${expire.getFullYear()}${issue.can_submit_after_expiration_date
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
      title: issue
        .title
        .trim(),
      url: issue.url,
      fields,
      footer: {
        icon_url: client.user.avatarURL,
        text: 'Powered by Gitcoin'
      }
    }
  };
};

const getNewIssues = () => {
  console.log(`Checking for new bounties...`)
  axios
    .get(API_URL)
    .then((result) => {
      issues = Object
        .values(result.data)
        .slice(0, 16)
        .map(createEmbed)
        .filter(issue => !titles.includes(issue.embed.title));
      issues.reverse();
      const newIssues = issues.filter(issue => !oldIssues.includes(issue));
      console.log(titles)
      console.log(issues)
      const gitcoinChannel = client
        .channels
        .get(process.env.GITCOIN_CHANNEL);
      issues.forEach((issue) => {
        console.log(`In titles: ${titles.includes(issue.embed.title)}`);
        titles.unshift(issue.embed.title)
        console.log(`New item pushed: ${issue.embed.title}.`);
        gitcoinChannel.send(issue);
      });
      oldIssues = issues;
      return true;
    })
    .catch(console.log);
};

client.on('error', console.error);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const gitcoinChannel = client
    .channels
    .get(process.env.GITCOIN_CHANNEL);
  gitcoinChannel
    .fetchMessages()
    .then(msgs => {
      const ids = msgs
        .filter(msg => msg.author.id === '521930921063088148')
        .map(msg => msg.id);
      ids.forEach(id => {
        gitcoinChannel
          .fetchMessage(id)
          .then(msg => {
            titles.push(msg.embeds[0].title.trim())
          })
      });
    })
    .catch(console.error);
  axios
    .get(API_URL)
    .then((result) => {
      issues = Object
        .values(result.data)
        .slice(0, 16)
        .map(createEmbed)
        .filter(issue => !titles.includes(issue.embed.title));
      issues.reverse();
      const channel = client
        .channels
        .get(process.env.GITCOIN_CHANNEL);
      console.log(titles)
      issues.forEach(issue => {
        titles.unshift(issue.embed.title);
        console.log(`In titles: ${titles.includes(issue.embed.title)}`);
        console.log(`.${issue.embed.title}.`);
        console.log(`New item pushed: .${issue.embed.title}.`);
        channel.send(issue)
      });
      oldIssues = issues;
      client.setInterval(getNewIssues, 60 * (1000 * 60));
      return true;
    })
    .catch(console.log);
});

client.login(process.env.BOT_TOKEN);