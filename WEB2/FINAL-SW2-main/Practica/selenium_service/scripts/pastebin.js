const { default: axios } = require('axios');
const { EmailMatcher, PhoneMatcher } = require('./matchers');

class Resources {
  /**
   * Class constructor.
   */
  constructor() {
    this.emails = [];
    this.telefonos = [];
  }

  /**
   * Method to update emails with a new match.
   * 
   * @param {String} email Email to be added.
   * @param {String} url Url where the email was found.
   */
  addEmail(email, url) {
    this.#addEntry(this.emails, email, url);
  }

  /**
   * Method to update phones with a new match.
   * 
   * @param {String} phone Phone number to be added.
   * @param {String} url Url where the phone was found.
   */
  addPhone(phone, url) {
    this.#addEntry(this.telefonos, phone, url);
  }

  /**
   * Function that returns an object representation of the
   * class, ready for usage with Scrapiffy.
   * 
   * @returns {Object} Minimized object with found assets.
   */
  toObject() {
    return {
      emails: this.emails,
      telefonos: this.telefonos
    }
  }

  /**
   * Private function that adds a new entry to the specify array,
   * or updates an existing one.
   * 
   * @param {Array<Object>} resource Resource array to update.
   * @param {String} entry Entry to add.
   * @param {String} url Url where the entry was found.
   */
  #addEntry(resource, entry, url) {
    // Check if entry is already present
    const entries = resource.map(r => r.id);
    if (entries.includes(entry)) {
      // Update entry with new match
      const oldEntry = resource.filter(r => r.id == entry)[0];
      this.#updateResource(oldEntry, url);
    } else {
      // Create new entry
      const newEntry = this.#createResource(entry, url);
      resource.push(newEntry);
    }
  }

  /**
   * Function that creates a resource object from a give match.
   * 
   * @param {String} match Match to convert to object.
   * @param {String} url Url where resource was found.
   */
  #createResource(match, url) {
    return {
      id: match,
      ocurrencias: [
        {
          timestamp: new Date().toString(),
          source: url
        }
      ]
    }
  }

  /**
   * Function that updates a matches object with a new url.
   * 
   * @param {Object} entry Entry to update.
   * @param {String} url Url where the entry was found.
   */
  #updateResource(entry, url) {
    entry.ocurrencias.push({
      timestamp: new Date().toString(),
      source: url
    });
  }
};

/**
 * Function to scrape connect to pasteBin and scrape suspicious data.
 * 
 * @param {Array<String>} pasteBinUrls pasteBin urls to scrape.
 * @returns {Promise<Object>} Object containing matches.
 */
async function scrapePasteBin(pasteBinUrls) {
  const resources = new Resources();

  for (let url of pasteBinUrls) {
    const urlMatches = await scrapeUrl(url);

    urlMatches.emails.forEach(email => {
      resources.addEmail(email, url);
    });
    urlMatches.telefonos.forEach(phone => {
      resources.addPhone(phone, url);
    });
  }

  return resources.toObject();
}

/**
 * Function that scrapes a PasteBin url looking for matches.
 * 
 * @param {String} url Url to scrape.
 * @returns {Promise<Object>} Obtect containing the matches found in the queried url.
 */
async function scrapeUrl(url) {
  // Initialize matches to empty object
  const matches = {
    emails: [],
    telefonos: []
  };

  try {
    // Get web page
    const response = await axios.get(url);
    const pageSource = response.data;

    // Scrape web page
    const emails = new EmailMatcher().getMatches(pageSource);
    matches.emails.push(...emails);

    const telefonos = new PhoneMatcher().getMatches(pageSource);
    matches.telefonos.push(...telefonos);
  } catch(error) {
    //console.log(error)
  }   
  finally {
    return matches;
  }
}

module.exports = scrapePasteBin;