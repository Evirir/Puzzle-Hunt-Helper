const {consoleID} = require('../config.json');

reportError = (message, err) => {
    message.client.channels.cache.get(consoleID).send(err);
    console.log(err);
};

module.exports = reportError;