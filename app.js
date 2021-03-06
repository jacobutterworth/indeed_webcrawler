// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const yargs = require('yargs');
const axios = require('axios');
const cheerio = require('cheerio');

const argv = yargs
  .usage('$0 [-j job] [-l location]', 'Indeed web crawler')
  .options({
    job: {
      description: 'What job type to search',
      alias: 'j',
      type: 'string',
    },
    location: {
      description: "Where you'd like to search it",
      alias: 'l',
      type: 'string',
    },
  })
  .check((argv) => {
    if (!argv.job) {
      argv.job = 'react%20native';
    }
    if (!argv.location) {
      argv.location = 'London';
    }
    return true;
  })
  .version(false)
  .help()
  .alias('help', 'h').argv;

const job = argv.job;
const location = argv.location;
const urlInput = `https://uk.indeed.com/jobs?q=${job}&l=${location}`;
console.log(urlInput);

axios.get(urlInput).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);

  const jobCardMainContent = $('.jobsearch-ResultsList')
    .find('.cardOutline')
    .find('.jobCard_mainContent')
    .find('.resultContent');

  const jobTitles = $(jobCardMainContent)
    .find('.jobTitle')
    .children()
    .children();

  const companyNames = $(jobCardMainContent).find('.companyName');

  const companyLocations = $(jobCardMainContent).find('.companyLocation');

  const salaries = $('.jobsearch-ResultsList')
    .find('.resultContent')
    .find('.salaryOnly')
    .find('.salary-snippet-container')
    .children();

  Object.values(jobTitles).forEach(function (value, index) {
    getJobTitle(value);
    getJobX(companyNames[index], html, 'name');
    getJobX(companyLocations[index], html, 'location');
    getJobSalary(salaries[index], html, index);
  });

  console.log('end');
});

function getJobTitle(element, index) {
  try {
    const title = element.attribs['title'];
    console.log('Job title: ' + title);
  } catch (e) {
    console.log('Job title not found for index: ' + index);
  }
}

function getJobX(element, html, xVal, index) {
  const $1 = cheerio.load(html);
  let result = $1(element).html();
  try {
    if (result.substring(0, 18) == '<a data-tn-element') {
      result = $1(element).children().html();
    }
    console.log('Company ' + xVal + ': ' + result);
  } catch (e) {
    console.log('Job ' + xVal + ' not found for index: ' + index);
  }
}

function getJobSalary(element, html, index) {
  const $ = cheerio.load(html);
  try {
    let salary = $(element)[0].children[1].data;
    console.log('Job salary: ' + salary);
  } catch (e) {
    console.log('Salary for index: ' + index + ' not found');
  }
}
