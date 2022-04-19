const {weighted_random} = require('./utils.js');

let fileStore = {
    files: [],
    weights: []
}

/**
 * Function to setup the file store according to the inputs
 * @param {int} n - Number of files
 * @param {Array.<float>} fileSizes - Array of file sizes of each file
 * @param {Array.<float>} weights - probability of each file
 * @param {float} totalWeight - Sum of probabilities of all files
 */
module.exports.setupFiles = (n, fileSizes, weights, totalWeight) => {
    for (let i = 0; i < n; i++) {
        fileStore.files.push({
            id: i,
            size: fileSizes[i],
            prob: weights[i] / totalWeight
        });
    }
    fileStore.weights = weights;
}

module.exports.verifyFiles = (n, fileSizes, probabilities) => {

    // Check that probabilities add up close to one, and mean of file size is approximately 1.

    //To-Do
    //p = sum(map(lambda f: f.p, fileStore.files))
    //mean_size = sum(map(lambda f: f.size, fileStore.files)) / len(fileStore.files)

    // logger.debug("Sum probabilties: {p}");
    // logger.debug("Mean file size: {mean_size}");

    console.log("Sum probabilties: " + fileStore.files.reduce((a, b) => a.prob + b.prob, 0));
    console.log("Mean file size: " + this.size() / fileStore.files.length);
}

/**
 * Function to pick a random file based of each file's probability
 * @returns {Object} File
 */
module.exports.getSampleFile = () => {
    // Sample as determined by probability weights.
    let randomFile = weighted_random(fileStore.files, fileStore.weights);
    //console.log(randomFile.id);
    return randomFile;
}

/**
 * Function to calculate the mean of sizes of all the files
 * @returns {float} MeanFileSizes
 */
module.exports.mean = () => {
    //return sum(map(lambda f: f.size, fileStore.files)) / len(fileStore.files)
    let size = 0;
    for(let i=0; i<fileStore.files.length; i++){
        size = fileStore.files[i].size;
    }
    return size/fileStore.files.length;
}

/**
 * Function to calculate the sum of sizes of all the files
 * @returns {float} sumFileSizes
 */
module.exports.size = () => {
    //return sum(map(lambda f: f.size, fileStore.files))
    let size = 0;
    for(let i=0; i<fileStore.files.length; i++){
        size += fileStore.files[i].size;
    }
    return size;
}