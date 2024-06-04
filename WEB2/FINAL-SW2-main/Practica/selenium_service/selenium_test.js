const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const {execSync} = require('child_process');

(async function example() {
  // Hide window (headless mode -> faster)
  const options = new Options();
  options.headless = true;

  // Build webdriver
  const driver = await new Builder()
    .forBrowser(Browser.FIREFOX)
    //.setFirefoxOptions(options)
    .build();

  try {
    // Go to url and print page source
    await driver.get('https://pastebin.com/w2Lv4ftE');
    execSync('sleep 5');

    // Press captcha and wait another 5 seconds
    const captcha = await driver.findElements(By.css('input'))
    for (let e of captcha) {
      await e.click();
      console.log(await e.getAttribute('type'));
    }
    execSync('sleep 100');

    //const source = await driver.getPageSource()
    console.log(source)
  } finally {
    // Close driver
    await driver.quit();
  }
})();
