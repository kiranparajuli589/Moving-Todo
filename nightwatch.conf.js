module.exports = {
    src_folders: ['test'],
    page_objects_path: './test/acceptance/pageObjects',
    test_settings: {
        default: {
            selenium_host: '127.0.0.1',
            launch_url: process.env.SERVER_HOST || 'http://127.0.0.1:8000',
            globals: {},
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                chromeOptions: {
                    args: ['disable-gpu'],
                    w3c: false
                }
            }
        }
    }
};