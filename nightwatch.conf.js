module.exports = {
  src_folders: ["tests"],
  // custom_commands_path: ["test/custom_commands"],
  page_objects_path: "./tests/acceptance/pageObjects",

  test_settings: {
    default: {
      launch_url: "http://localhost:8000",
    },
    selenium: {
      selenium: {
        start_process: true,
        server_path: require("selenium-server").path,
        port: 4444,
        cli_args: {
          "webdriver.gecko.driver": require("geckodriver").path,
          "webdriver.chrome.driver": require("chromedriver").path,
          "webdriver.ie.driver":
            process.platform === "win32" ? require("iedriver").path : "",
        },
      },
      webdriver: {
        start_process: false,
      },
    },

    chrome: {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: ["--headless", "--no-sandbox", "--disable-gpu"],
          w3c: false,
        },
      },
    },

    firefox: {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "firefox",
        "moz:firefoxOptions": {
          args: ["--headless"],
        },
      },
    },

    ie: {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "internet explorer",
      },
    },
  },
};
