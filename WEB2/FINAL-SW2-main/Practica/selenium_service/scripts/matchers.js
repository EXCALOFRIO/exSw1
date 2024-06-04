/**
 * Abstract class that implements a Template Method pattern.
 */
class Matcher {

  /**
   * Method to get all valid matches from a document. Implements 
   * template method.
   *
   * @param {string} document Document to be parsed.
   * @returns {Array<string>} Array of matches.
   */
  getMatches(document) {
    const matches = this.parseDocument(document);
    return this.filterMatches(matches)
  }

  /**
   * Method to extract matches from a document. It should be overwriten in
   * subclasses.
   * 
   * @param {string} document Document to be parsed.
   * @returns {Array<string>} Array of matches.
   */
  parseDocument(document) {
    throw Error("NotImplementedError");
  }

  /**
   * Method that filters out false positives from the received matches.
   *
   * @param {Array<string>} matches Array of matches to be filtered.
   * @returns {Array<string>} filtered array of matches.
   */
  filterMatches(matches) {
    return this.#removeDuplicates(matches);
  }

  /**
   * Private function that removes duplicates from a list of matches
   * 
   * @param {Array<string>} matches Array of matches to be filtered.
   * @returns {Array<string>} Matches without duplicates.
   */
  #removeDuplicates(matches) {
    // Remove previously found entries
    const uniqueMatches = [];
    matches.forEach(match => {
      if (!(match in uniqueMatches)) {
        uniqueMatches.push(match)
      }
    });

    return uniqueMatches;
  }
};

/**
 * URL Matcher.
 * 
 * @extends Matcher
 */
class URLMatcher extends Matcher {
  /**
   * Method to extract matches from a document.
   * 
   * @param {string} document Document to be parsed.
   * @returns {Array<string>} Array of matches.
   */
  parseDocument(document) {
    const regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
    return [...document.matchAll(regex)].map(match => match[0]);
  }
}

/**
 * Email Matcher.
 * 
 * @extends Matcher
 */
class EmailMatcher extends Matcher {
  /**
   * Method to extract matches from a document.
   * 
   * @param {string} document Document to be parsed.
   * @returns {Array<string>} Array of matches.
   */
  parseDocument(document) {
    const regex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g;
    return [...document.matchAll(regex)].map(match => match[0]);
  }
}

/**
 * Phone Matcher
 * 
 * @extends Matcher
 */
class PhoneMatcher extends Matcher {
  /**
   * Method to extract matches from a document.
   * 
   * @param {string} document Document to be parsed.
   * @returns {Array<string>} Array of matches.
   */
  parseDocument(document) {
    const regex = /(?:\+\(?\d{1,3}\)?)?[ ]?\d{6,13}/g
    return [...document.matchAll(regex)].map(match => match[0].trim());
  }
}

module.exports = {
  Matcher,
  URLMatcher,
  EmailMatcher,
  PhoneMatcher
};
