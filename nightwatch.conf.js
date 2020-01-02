const chromeDriver = require('chromedriver')
const geckoDriver = require('geckodriver')

module.exports = {
    src_folders: ['test'],
    page_objects_path: './test/acceptance/pageObjects',
    // for chrome driver
    webdriver : {
        start_process: true,
        server_path: chromeDriver.path,
        port: 9515
    },
    // for gecko driver
    // webdriver: {
    //     start_process: false, // set true if you are not running selenium manually
    //     port: 4444,
    //     server_path: geckoDriver.path,
    //     cli_args: [
    //         "--log", "debug"
    //         // very verbose geckodriver logs
    //         // '-vv'
    //     ]
    // },
    test_settings: {
        default: {
            selenium_host: '127.0.0.1',
            selenium_port: 4444,
            launch_url: 'http://127.0.0.1:8000',
            globals: {},
            // for chrome
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                chromeOptions: {
                    args: ['disable-gpu'],
                    w3c: false
                }
            }
            // for mozilla firefox
            // desiredCapabilities: {
            //     browserName: 'firefox',
            //     alwaysMatch: {
            //         // Enable this if you encounter unexpected SSL certificate errors in Firefox
            //         acceptInsecureCerts: true,
            //         // 'moz:firefoxOptions': {
            //         //     args: [
            //         //         // '-headless',
            //         //         '-verbose'
            //         //     ],
            //         // }
            //     }
            // }
        }
    }
}