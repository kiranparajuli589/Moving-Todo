const { setDefaultTimeout, After, Before, BeforeAll, AfterAll } = require('cucumber');
const { createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');

setDefaultTimeout(60000);
const availableBrowsers = ["chrome", "firefox", "ie"]

const browser = process.env.BROWSER || 'chrome'
if (!availableBrowsers.includes(browser)) {
    throw new Error(`\nInvalid browser selected.\nAvailable browsers: ${availableBrowsers.join(", ")}\n`)
}

BeforeAll(async () => {
    await startWebDriver({ env: browser });
});

Before(async () => {
    await createSession({ env: browser });
})

After(async () => {
    await closeSession();
});

AfterAll(async () => {
    await stopWebDriver();
})
