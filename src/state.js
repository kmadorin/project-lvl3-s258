import isURL from 'validator/lib/isURL';

export default class State {
  constructor() {
    this.input = '';
    this.feeds = new Set();
  }

  isDuplicated() {
    return this.feeds.has(this.input);
  }

  isInputValid() {
    return ((!this.isDuplicated() && isURL(this.input)) || (this.input.length === 0));
  }

  addFeed(url) {
    this.feeds.add(url);
  }
}
