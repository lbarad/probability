const { getConfig } = require("./config");
const { mean } = require("./files");
const fs = require('fs');

let response_times = [];
let cache_hits = [];
let total_cache_hits = 0;
let totalEventsProcessed = 0;
let totalRequestsProcessed = 0;
let startTime;
let endTime;
let cacheMissRate;

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
    total_cache_hits += ch;
}

/**
 * Function to get response times array
 * @returns {Array.<float>}
 */
module.exports.getResponseTimes = () => {
    return response_times;
}

/**
 * Function to increment total events processed
 */
module.exports.incrementTotalEvents = () => {
    totalEventsProcessed += 1;
}

module.exports.setTotalRequestsProcessed = (trp) => {
    totalRequestsProcessed = trp;
}

module.exports.startTimer = () => {
    startTime = Date.now();
}

module.exports.endTimer = () => {
    endTime = Date.now();
}

/**
 * Function to print the statistics of the simulation
 */
module.exports.printStats = () => {
    cacheMissRate = 1 - (total_cache_hits / totalRequestsProcessed);
    console.log(
        `Time taken for simulation : ${(endTime - startTime) / 1000}

Cache size: ${getConfig()["cacheSize"]}

No of files: ${getConfig()["numFiles"]}

Total requests : ${totalRequestsProcessed} 

Total Events processed : ${totalEventsProcessed}

Total Cache hits : ${total_cache_hits}

Cache Miss Rate : ${cacheMissRate}

Estimated Inbound Traffic Rate : ${cacheMissRate * parseFloat(getConfig()["requestRate"])} requests / second

Average Access Link Load: ${cacheMissRate * parseFloat(getConfig()["requestRate"]) * mean() / parseFloat(getConfig()["accessLinkBandwidth"])}`)
}

/**
 * Function to generate csv for results
 */
module.exports.generateCSV = () => {
    let string = `Response Time,Cache hit, cache miss rate,${Object.keys(getConfig())}\n`;
    for(let i=0; i<response_times.length;i++){
        if(i==0)
            string += `${response_times[i]},${cache_hits[i]},${cacheMissRate},${Object.values(getConfig())}\n`;
        else
            string += `${response_times[i]},${cache_hits[i]}\n`;
    }
    fs.writeFile('outputs/test.csv', string, function (err) {
        if (err) throw err;
        console.log('csv is created successfully in outputs folder.');
      });
}
