module.exports.nextExponential = function (lambda) {
    if ('number' !== typeof lambda) {
        throw new TypeError('nextExponential: lambda must be number.');
    }
    if (lambda <= 0) {
        throw new TypeError('nextExponential: ' +
            'lambda must be greater than 0.');
    }
    return - Math.log(1 - Math.random()) / lambda;
}