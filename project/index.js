var fs = require('fs');

const { initConfig, getConfig } = require('./config.js');
const { PriorityQueue } = require('./priorityQueue.js');
const { NewRequestEvent } = require('./events.js');
const { setupFiles, getSampleFiles } = require('./files.js');

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
initConfig(inputConfig);

console.log(JSON.stringify(inputConfig, null, 2));


let paretoAlpha = inputConfig["Pareto_Alpha"];
let num_files = inputConfig["Num_Files"];
let paretoSeed = inputConfig["Pareto_seed"];
let totalRequests = getConfig()["Total_Requests"];
let time_limit = getConfig()["Time_Limit"];

let pQueue = new PriorityQueue({
    compare: (e1, e2) => {
        return e1.time < e2.time ? 1 : -1;
    }
});

let file_sizes = generateParetoDistribution(paretoSeed, paretoAlpha, num_files);
let probabilities = generateParetoDistribution(paretoSeed, paretoAlpha, num_files);
let currentTime = 0;
let requestsProcessed = 0;
let totalProbability = probabilities.reduce((partialSum, a) => partialSum + a, 0);

//TO-DO
//setupFiles();
//let cache = setupCache(); //This should setup the cache according to the cache stratergy

pQueue.enqueue(new NewRequestEvent(currentTime, getSampleFiles()));

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