let response_times = [];
let cache_hits = [];
let total_cache_hits = 0;


module.exports.appendToResponseTimes = (rt) => {
    response_times.push(rt);
}

module.exports.appendToCacheHits = (ch) => {
    cache_hits.push(ch);
}

module.exports.incrementCacheHits = (ch) => {
    total_cache_hits+=ch;
}

module.exports.getResponseTimes = () => {
    return response_times;
}

module.exports.getCacheHits = () => {
    return cache_hits;
}

module.exports.getTotalCacheHits = () => {
    return total_cache_hits;
}

