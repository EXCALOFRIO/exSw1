const {URLMatcher, EmailMatcher, PhoneMatcher} = require("../scripts/matchers");

describe("URLMatcher Tests", () => {
  it("Simple URL Matcher Test", () => {
    const urlMatcher = new URLMatcher();
    expect(urlMatcher.parseDocument("www.google.es")).toEqual([])
  })

  it("http URL Matcher Test", () => {
    const urlMatcher = new URLMatcher();
    expect(urlMatcher.parseDocument("http://www.google.es")).toEqual(["http://www.google.es"])
  })

  it("https URL Matcher Test", () => {
    const urlMatcher = new URLMatcher();
    expect(urlMatcher.parseDocument("https://www.google.es")).toEqual(["https://www.google.es"])
  })

  it("Long text with URL inside", () => {
    const urlMatcher = new URLMatcher();
    expect(urlMatcher.parseDocument("hola buenos dias que tal va todo https://www.google.es ")).toEqual(["https://www.google.es"])
  })

  it("Long text with many URLs inside", () => {
    const urlMatcher = new URLMatcher();
    expect(urlMatcher.parseDocument("hola buenos dias que tal va todo https://www.google.es es un grand dia hoy http://www.google.es")).toEqual(["https://www.google.es","http://www.google.es",])
  })
});

describe("EmailMatcher Tests", () => {
  const emailMatcher = new EmailMatcher();
  it("Simple email Matcher Test", () => {
    expect(emailMatcher.parseDocument("test@gmail.com")).toEqual(["test@gmail.com"])
  })

  it("Strange email Matcher Test", () => {
    expect(emailMatcher.parseDocument("test@marca.com")).toEqual(["test@marca.com"])
  })

  it("Long text email Matcher Test", () => {
    expect(emailMatcher.parseDocument("Hola buenos dias que tal soy test@gmail.com")).toEqual(["test@gmail.com"])
  })

  it("Two emails inside long text Matcher Test", () => {
    expect(emailMatcher.parseDocument("Hola buenos dias que tal soy test@gmail.com y mi compañero es test2@gmail.com")).toEqual(["test@gmail.com", "test2@gmail.com"])
  })

  it("Lots of email using different types Matcher test", () => {
    expect(emailMatcher.parseDocument("test@gmail.com y mi compañero es test2@gmail.com y mi amigo es t@marc.com y su amigo es marca@marca.com")).toEqual(["test@gmail.com", "test2@gmail.com", "t@marc.com", "marca@marca.com"])
  })

});

describe("PhoneMatcher Tests", () => {
  it("Simple phone Matcher Test", () => {
    const phoneMatcher = new PhoneMatcher();
    expect(phoneMatcher.parseDocument("+34123456789")).toEqual(["+34123456789"])
  })

  it("Simple phone with spaces Matcher Test", () => {
    const phoneMatcher = new PhoneMatcher();
    expect(phoneMatcher.parseDocument("+34 123 456 789")).toEqual([])
  })

  it("Simple phone without mobile prefix Matcher Test", () => {
    const phoneMatcher = new PhoneMatcher();
    expect(phoneMatcher.parseDocument("123456789")).toEqual(["123456789"])
  })

  it("Simple phone with spaces and without mobile prefix Matcher Test", () => {
    const phoneMatcher = new PhoneMatcher();
    expect(phoneMatcher.parseDocument("123 456 789")).toEqual([])
  })

  it("Many phones text Matcher Test", () => {
    const phoneMatcher = new PhoneMatcher();
    expect(phoneMatcher.parseDocument("hola soy 123456789 y mi amigo es el +34987654321")).toEqual(["123456789", "+34987654321"])
  })

});
