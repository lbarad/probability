
let fileStore = {
    files: [],
    cumulative_weights: []
}

module.exports.setupFiles = (n, fileSizes, probabilities, totalProbability) => {
    for (let i = 0; i < n; i++) {
        fileStore.files.push({
            id: i,
            size: fileSizes[i],
            prob: probabilities[i] / totalProbability
        });
    }
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

module.exports.getSampleFiles = () => {
    // Sample as determined by probability weights.
    return weighted_random(fileStore.files, fileStore.cumulative_weights);
}

module.exports.mean = () => {
    //return sum(map(lambda f: f.size, fileStore.files)) / len(fileStore.files)
    let size = 0;
    for(let i=0; i<fileStore.files.length; i++){
        size = fileStore.files[i].size;
    }
    return size/fileStore.files.length;
}

module.exports.size = () => {
    //return sum(map(lambda f: f.size, fileStore.files))
    let size = 0;
    for(let i=0; i<fileStore.files.length; i++){
        size = fileStore.files[i].size;
    }
    return size;
}

function weighted_random(items, weights) {
    let i;

    // for (i = 0; i < weights.length; i++)
    //     weights[i] += weights[i - 1] || 0;
    
    let random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}