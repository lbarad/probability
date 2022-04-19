const { getConfig } = require('./config.js');
const { nextExponential } = require('./utils.js');
const { getSampleFile } = require('./files.js');
const { Queue } = require('./Queue.js');
const { appendToCacheHits, appendToResponseTimes, incrementCacheHits } = require('./stats.js');

class Event {
    constructor(time, file, prev, meta) {
        this.time = time;
        this.file = file;
        this.prev = prev;
        this.meta = meta ? meta : {};
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
        if (cache.get(this.file)) {
            let networkBandwidth = parseFloat(getConfig()["networkBandwidth"])
            queue.enqueue(
                new FileRecievedEvent(
                    currentTime + (this.file.size / networkBandwidth),
                    this.file,
                    this,
                    { "cache_hit": true }
                )
            )
        }
        else {
            let roundTrip = parseFloat(getConfig()["roundTrip"])
            queue.enqueue(
                new ArriveAtQueueEvent(currentTime + roundTrip, this.file, this),
            )
        }

        let requestRate = parseFloat(getConfig()["requestRate"]);
        let poissonSample = nextExponential(1 / requestRate);
        queue.enqueue(new NewRequestEvent(currentTime + poissonSample, getSampleFile()));
    }
}

class FileRecievedEvent extends Event {

    process(queue, cache, current_time) {
        // This event represents that a file has been received by the user.
        //   When processing such an event, the following need to be done.
        //   calculate the response time associated with that file and record the
        //   response time (a data sample has been collected).

        // For now, print tracebacks.
        let end = this.time;
        let p = this.prev;
        while (p.prev) {
            p = p.prev;
        }
        let start = p.time;
        appendToResponseTimes(end - start);
        appendToCacheHits(this.meta["cache_hit"]);
        incrementCacheHits(this.meta["cache_hit"]);
        return 1;
    }
}

let FIFO_QUEUE = new Queue();

class ArriveAtQueueEvent extends Event {
    process(queue, cache, current_time) {

        // if the queue is not empty,
        // add the file (i.e., the info about the file)
        // at the end of the FIFO queue.

        if (!FIFO_QUEUE.isEmpty())
            FIFO_QUEUE.enqueue([this.file, this]);
        else {
            // if the queue is empty,
            // generate a new depart - queue - event,
            // with the event - time = current - time + Si / Ra
            let r_a = parseFloat(getConfig()["accessLinkBandwidth"]);
            queue.enqueue(new DepartQueueEvent(
                current_time + (this.file.size / r_a), this.file, this
            ));
        }
    }
}

class DepartQueueEvent extends Event {
    process(queue, cache, current_time) {

        // store the new file in the cache if there is enough space.
        // If the cacheis full, remove enough files based on your cache replacement policy
        // and store the new file
        // .- generate a new file-received-event, with the event-time = current-time +Si/Rc

        cache.add(this.file);
        let networkBandwidth = parseFloat(getConfig()["networkBandwidth"]);
        queue.enqueue(new FileRecievedEvent(
            current_time + (this.file.size / networkBandwidth),
            this.file,
            this,
            { "cache_hit": false },
        ));

        if (!FIFO_QUEUE.isEmpty()) {

            // If the FIFO queue is not empty, generate a new depart-queue-event
            // for the head-of-queue file, say j, with the event-time = current-time+Sj/Ra

            let [head, ev] = FIFO_QUEUE.dequeue();
            r_a = parseFloat(getConfig()["accessLinkBandwidth"]);
            queue.enqueue(new DepartQueueEvent(current_time + (head.size / r_a), head, ev));
        }
    }
}

module.exports.NewRequestEvent = NewRequestEvent;
module.exports.FileRecievedEvent = FileRecievedEvent;
module.exports.ArriveAtQueueEvent = ArriveAtQueueEvent;