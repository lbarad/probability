const { getConfig } = require('./config.js');
const { nextExponential } = require('./utils.js');

class Event {
    constructor(time, file) {
        this.time = time;
        this.file =  file;
        let prev;
    }

    lessThan(otherEvent) {
        return this.time < other.time
    }

    lessThanOrEquals(otherEvent) {
        return this.time <= other.time
    }
}


class NewRequestEvent extends Event {

    process(queue, cache, currentTime) {
        if (cache.has(this.file)) {
            network_bandwidth = parseFloat(getConfig()["network_bandwidth"])
            queue.enqueue(
                new FileRecievedEvent(
                    currentTime + (this.file.size / network_bandwidth),
                    this.file,
                    self,
                    { "cache_hit": True }
                )
            )
        }
        else {
            roundTrip = parseFloat(getConfig()["Round_Trip"])
            queue.enqueue(
                new ArriveAtQueueEvent(currentTime + roundTrip, this.file, self),
            )
        }

        requestRate = parseFloat(getConfig()["request_rate"]);
        poissonSample = nextExponential(1 / requestRate);
        queue.enqueue(new NewRequestEvent(currentTime + poissonSample, FileStore.sample()));
    }
}

module.exports.NewRequestEvent = NewRequestEvent;