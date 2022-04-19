let response_times = [];
let cache_hits = [];
let total_cache_hits = 0;

/**
 * Function to append value to response times array
 * @param {float} rt 
 */
module.exports.appendToResponseTimes = (rt) => {
    response_times.push(rt);
}

/**
 * Function to append value to cache hits array
 * @param {boolean} ch 
 */
module.exports.appendToCacheHits = (ch) => {
    cache_hits.push(ch);
}

/**
 * Function to increment cache hits
 * @param {number} ch
 */
module.exports.incrementCacheHits = (ch) => {
    total_cache_hits+=ch;
}

/**
 * Function to get response times array
 * @returns {Array.<float>}
 */
module.exports.getResponseTimes = () => {
    return response_times;
}

/**
 * Function to get Cache hits array
 * @returns {Array.<boolean>}
 */
module.exports.getCacheHits = () => {
    return cache_hits;
}

/**
 * Function to get the total cache hits
 * @returns {number}
 */
module.exports.getTotalCacheHits = () => {
    return total_cache_hits;
}

/**
 * Function to print the statistics of the simulation
 */
module.exports.printStats = () => {
    console.log(
`Total requests : ${response_times.length} 

Total Cache hits : ${total_cache_hits}

Response times : ${response_times}

Cache hits : ${cache_hits}`)
}

