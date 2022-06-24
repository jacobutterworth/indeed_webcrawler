// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const what = 'react%20native';
const where = 'London';
const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://uk.indeed.com/?r=us';
let urlInput = `https://uk.indeed.com/jobs?q=${what}&l=${where}`;
console.log(urlInput);

axios.get(urlInput).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  // console.log($('.jobsearch-ResultsList').html());
  // console.log($('.jobTitle').children().html());
  const titleClass = $('.jobTitle').children();
  const jobeElement = titleClass['16'];
  const testingDeets = jobeElement.children['0'];
  const title = jobeElement.children['0'].attribs['title'];
  console.log('Title: ' + title);

  const companyName = $('.companyName').html();
  console.log('Company name: ' + companyName);

  const companyLocation = $('.companyLocation').html();
  console.log('Company location: ' + companyLocation);

  console.log('end');
});
