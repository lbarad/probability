let config = {};

module.exports.initConfig = (input) => {
    config = input;
}

module.exports.getConfig = () => { return config }