/**
 * Function to get the next item in exponential distribution
 * @param {float} lambda 
 * @returns {float}
 */
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

/**
 * Weighted random picking of an element from the items array according to weights
 * @param {Array.<*>} items 
 * @param {Array.<float>} weights 
 * @returns {*} item
 */
module.exports.weighted_random = function (items, weights) {
    let i;

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;
    
    let random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}