// from queue import Queue
// from filepopulation import File
// from typing import Union
// from collections import OrderedDict

const Queue = require("queue-fifo");

module.exports.setupCache = (cacheType, capacity) => {
  if (cacheType == "LRU") {
    return new LRUCache(capacity);
  }
  else if (cacheType == "FIFO") {
    return new FIFOCache(capacity);
  }
  else if (cacheType == "LF") {
    return new LargestFirstCache(capacity);
  }
  else {
    throw "Invalid cache type! Please select from [LRU, FIFO, LF]"
  }
}


class LRUCache {
  //Oldest First / Least Popular

  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map();
  }

  size() {
    let sum = 0;
    this.cache.forEach((value)=>{
      sum += value.size;
    });
    // for (let i = 0; i < this.cache.size; i++) {
    //   sum += this.cache.values()[i].size;
    // }
    return sum;
  }



  get(file) {
    if (file.id in this.cache) {
      //this.cache.move_to_end(file.id);
      let temp = this.cache[file.id];
      this.cache.delete(file.id);
      this.cache.set(file.id, temp);
      return this.cache[file.id];
    } else {
      return null;
    }
  }

  add(file) {
    if (file.id in this.cache)
      return
    this.cache.set(file.id, file);
    let size = this.size();
    while (size >= this.capacity) {
      let key = this.cache.keys[0];
      let itemSize = this.cache[key].size;
      delete this.cache[key];
      //(_, item) = self.cache.popitem(last = False)
      size -= itemSize
    }
  }
}


class LargestFirstCache {

  constructor(capacity) {
    this.capacity = capacity
    this.cache = {}
  }

  size() {
    let sum = 0;
    for (let i = 0; i < this.cache.size(); i++) {
      sum += this.cache.values()[i].size;
    }
    return sum;
  }

  get(file) {
    if (file.id in self.cache)
      return this.cache[file.id]
    else
      return null
  }

  add(file) {
    if (file.id in self.cache)
      return
    let size = this.size()
    while (size + file.size >= self.capacity) {
      if (!this.cache)
        return
      //TO-DO find largest
      // largest = Math.max(this.cache, key = (lambda x: self.cache[x].size))
      // let largest = this.cache.reduce((a,b)=>a.y>b.y?a:b)
      size -= this.cache[largest].size
      delete this.cache[largest]
    }
    this.cache[file.id] = file
  }
}

class FIFOCache {

  //FIFO Cache


  constructor(capacity) {
    this.capacity = capacity
    this.cache = {}
    this.queue = new Queue();
  }

  size() {
    let sum = 0;
    for (let i = 0; i < this.cache.size(); i++) {
      sum += this.cache.values()[i].size;
    }
    return sum;
  }

  get(file) {
    return this.cache.get(file.id);
  }

  add(file) {
    if (file.id in self.cache)
      return
    size = this.size();
    while (size + file.size >= this.capacity) {
      if (!this.queue)
        return
      let k = this.queue.dequeue();
      if (k in self.cache) {
        this.size -= self.cache[k].size;
        delete self.cache[k];
      }
    }
    this.cache[file.id] = file;
    this.queue.enqueue(file.id);
  }
}
