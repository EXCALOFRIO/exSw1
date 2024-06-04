// Load environment variables
require('dotenv').config();

// Import libraries and helper functions
const getTargetUrls = require('./scripts/scraping_ant');
const scrapePasteBin = require('./scripts/pastebin');
const updateService = require('./scripts/scrapiffy_integration');

/**
 * Main function. Acts as entry point to the program.
 * 
 * @returns {Promise}
 */
async function main() {
  // Get paste bin urls to interesting pastes
  const keywords = ['phone', 'email', 'gmail', 'phone numbers', 'email leaks', 'gmail leaks', 'phone number leaks'];
  const pasteBinUrls = await getTargetUrls(keywords);

  // Scrape previously obtained urls
  const matches = await scrapePasteBin(pasteBinUrls);

  // Update scrapiffy
  await updateService(matches);
}

// Run main function
(async() => await main())();