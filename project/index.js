var fs = require('fs');

const { initConfig, getConfig } = require('./config.js');
const { PriorityQueue } = require('./priorityQueue.js');
const { NewRequestEvent, FileRecievedEvent } = require('./events.js');
const { setupFiles, getSampleFile } = require('./files.js');
const { setupCache } = require('./cache.js');
const { printStats } = require('./stats.js');

//const inputFileName = process.argv[2];
const inputFileName = "config.json";


let generateParetoDistribution = (minimum, alpha, size) => {
    let res = [];
    for (let i = 0; i < size; i++) {
        var u = 1.0 - Math.random();
        res.push(minimum / Math.pow(u, 1.0 / alpha));
    }
    return res;
}

var inputConfig = JSON.parse(fs.readFileSync('inputs/' + inputFileName, 'utf8'));
initConfig(inputConfig.config);

console.log(JSON.stringify(inputConfig, null, 2));

// File i has a size Si,
// which is a sample drawn from a Pareto distribution (heavy tail),
// F_S, with mean μ (e.g., μ= 1 MB).
let paretoAlpha = getConfig()["paretoAlpha"];
let num_files = getConfig()["numFiles"];
let paretoSeed = getConfig()["paretoSeed"];
let totalRequests = getConfig()["totalRequests"];
let time_limit = getConfig()["timeLimit"];

let pQueue = new PriorityQueue({
    compare: (e1, e2) => {
        return e1.time < e2.time ? -1 : 1;
    }
});

// Sample from pareto distribution for the file_sizes, mean should be ~1
let file_sizes = generateParetoDistribution(paretoSeed, paretoAlpha, num_files);

// Sample from pareto distribution for the file probabilities,
// We then calculate the file probability as probabilitie[i]/sum(probabilities)
let probabilities = generateParetoDistribution(paretoSeed, paretoAlpha, num_files);
let totalProbability = probabilities.reduce((partialSum, a) => partialSum + a, 0);


let currentTime = 0;
let requestsProcessed = 0;

setupFiles(num_files, file_sizes, probabilities, totalProbability);
let cache = setupCache(getConfig()["cacheType"], parseFloat(getConfig()["cacheSize"])); //This should setup the cache according to the cache stratergy

pQueue.enqueue(new NewRequestEvent(currentTime, getSampleFile()));

//loop_start = time.time()
let event_count = 0

while (requestsProcessed < totalRequests || currentTime < time_limit) {
    let event = pQueue.dequeue();
    currentTime = event.time;
    event.process(pQueue, cache, currentTime);
    event_count += 1
    if (event instanceof FileRecievedEvent)
        requestsProcessed += 1
}

printStats();