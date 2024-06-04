const axios = require('axios');
const { URLMatcher } = require('./matchers');

/**
 * Function to use API to look for target URLs using Scraping Ant's API.
 * 
 * @param {Array<String>} keywords Keywords to query using Scraping Ant.
 * @returns {Promise<Array<String>>} List of pasteBin URLs to scrape using selenium.
 */
async function getTargetUrls(keywords) {
  const pasteBinUrls = [];

  for (let keyword of keywords) {
    const response = await makeAPIRequest(keyword);
    const extractedUrls = extractPastBinUrls(response);

    pasteBinUrls.push(...extractedUrls);
  }

  return pasteBinUrls;
}

/**
 * Function that gets PastBins landing page using Scraping Ants.
 * 
 * @param {String} keyword Keyword to use in request
 * @returns {Promise<String>} html source of PastBins page for requested query.
 */
async function makeAPIRequest(keyword) {
  // Build google query -> format keyword to replace spaces with +
  const formatedKeyword = `"${keyword.replace(' ', '+')}"`;""
  const apiQuery = `${process.env.API_URI}&q=${formatedKeyword}&api_key=${process.env.API_KEY}`;

  try {
    // Make API request
    const response = await axios.get(apiQuery);

    // Return request body
    return response.data;
  } catch(error) {
    return '';
  }
}

/**
 * Function that extracts all PastBin URLs from a document. 
 * 
 * @param {Object} response JSON API's response.
 */
function extractPastBinUrls(response) {
  // Get urls from document
  const urls = response.organic_results.map(r => r.link);

  // Filter out non-pastebin urls
  //return urls.filter(url => url.includes('pastebin.com/'));
  return urls;
}

module.exports = getTargetUrls;
