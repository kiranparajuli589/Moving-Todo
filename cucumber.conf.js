const {
  setDefaultTimeout,
  After,
  Before,
  BeforeAll,
  AfterAll,
} = require("cucumber");
const {
  createSession,
  closeSession,
  startWebDriver,
  stopWebDriver,
} = require("nightwatch-api");
const axios = require("axios").default;

setDefaultTimeout(60000);
const availableBrowsers = ["chrome", "firefox", "ie"];

const browser = process.env.BROWSER || "chrome";

if (!availableBrowsers.includes(browser)) {
  throw new Error(
    "\nInvalid browser selected.\n" +
      "Available browsers: " +
      availableBrowsers.join(", ") +
      "\n"
  );
}

BeforeAll(async () => {
  await startWebDriver({ env: browser });
});

Before(async () => {
  await createSession({ env: browser });
});

After(async () => {
  await closeSession();
  const res = await axios.delete("http://localhost:8000/clean-todo");
  if (res.status === 200) {
    console.log("database: cleared");
  } else {
    throw new Error("Failed while db cleanup.");
  }
});

AfterAll(async () => {
  await stopWebDriver();
});
