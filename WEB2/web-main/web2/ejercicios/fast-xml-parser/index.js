const { XMLParser } = require('fast-xml-parser');

const xmlData = `
  <person>
    <name>John Doe</name>
    <age>30</age>
    <city>New York</city>
  </person>
`;

const options = {
  ignoreAttributes: true,
};

const parser = new XMLParser(options);
const jsonObj = parser.parse(xmlData);

console.log(jsonObj);

console.log(JSON.stringify(jsonObj));
