var LRUCache = function (limit) {
  this.limit = limit;
  this.sized = 0;
  this.head = null;
  this.tail = null;
};

LRUCache.prototype.moveToFront = function(currNode) {
  if (currNode === this.tail) {
    currNode.next = this.head;
    this.head.prev = currNode;
    currNode.prev.next = null;
    this.tail = currNode.prev
    this.head = currNode
    this.head.prev = null;
  } else if (currNode != this.head) {
    currNode.next.prev = currNode.prev;
    currNode.prev.next = currNode.next;
    this.head.prev = currNode;
    currNode.next = this.head;
    currNode.prev = null;
    this.head = currNode;
  }
}

LRUCache.prototype.set = function (key, val) {
  if (this.sized < this.limit) {
    if (this.head === null) {
      this.head = this.tail = {prev: null, next: null, key: key, val: val}
    } else {
      this.head = {prev: null, next: this.head, key: key, val: val};
      this.head.next.prev = this.head;
    }
    this.sized ++;
  } else {
    let currNode = this.head;
    while (currNode) {
      if (currNode.key === key) {
        currNode.val = val;
        this.moveToFront(currNode)
        return;
      }
      currNode = currNode.next;
    }
    let newHead = {prev: null, next: this.head, key: key, val: val};
    this.head.prev = newHead;
    this.head = newHead;
    this.tail = this.tail.prev;
    this.tail.next.prev = null;
    this.tail.next = null;
  }
}

LRUCache.prototype.get = function (key) {
  let currNode = this.head;
  while (currNode) {
    if (currNode.key === key) {
      this.moveToFront(currNode)
      return currNode.val
    }
    currNode=currNode.next;
  }
  return null;
};

LRUCache.prototype.delete = function (key) {
  let currNode = this.head;
  while (currNode) {
    if (currNode.key === key) {
      if (currNode === this.head) {
        if (this.head.next === null) {
          this.head = null;
          this.tail = null;
        } else {
          this.head.next.prev = null;
          this.head = this.head.next;
          currNode.next = null;
        }
      } else if (currNode === this.tail) {
        this.tail = this.tail.prev;
        this.tail.next.prev = null;
        this.tail.next = null;
      } else {
        currNode.prev.next = currNode.next;
        currNode.next.prev = currNode.prev;
        currNode.next = null;
        currNode.prev = null;
      }
      this.sized --;
      return true;
    }
    currNode=currNode.next;
  }
  return false;
};

module.exports.LRUCache = LRUCache