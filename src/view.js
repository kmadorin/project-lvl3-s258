import { createElement, getFeedContent, getFeedItems } from './utils';

export default class RssReaderView {
  constructor(state) {
    this.state = state;
    this.template = `<div class="container">
      <div class="row">
        <div class="col">
          <div id="error"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="jumbotron">
            <h1>RSS Reader</h1>
            <form id="reader-form" novalidate>
              <div class="form-group">
                <input type="text" class="form-control" id="feed" name="feed" required placeholder="add rss feed here">
                <span class="invalid-feedback">Input value is incorrect URL or has been already added</span>
              </div>
              <button type="submit" id="addFeed" class="btn btn-primary">Add</button>
            </form>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h2>Channels:</h2>
          <ul id="channels-list">
          </ul>
        </div>
        <div class="col">
          <h2>Articles:</h2>
          <ul id="articles-list">
          </ul>
        </div>
      </div>
    <div>`;
  }

  get element() {
    if (!this.elem) {
      this.elem = this.render();
      this.bind();
    }
    return this.elem;
  }

  render() {
    return createElement(this.template);
  }

  bind() {
    const feedInput = this.element.querySelector('#feed');
    feedInput.addEventListener('input', (event) => {
      const { target } = event;
      this.state.input = target.value;

      if (!this.state.isInputValid()) {
        target.classList.add('is-invalid');
      } else {
        target.classList.remove('is-invalid');
      }
    });

    const readerForm = this.element.querySelector('#reader-form');
    const channelsElem = this.element.querySelector('#channels-list');
    const articlesElem = this.element.querySelector('#articles-list');
    readerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.state.isInputValid()) {
        const url = this.state.input;
        getFeedContent(this.state.input).then((rssContent) => {
          const title = rssContent.querySelector('title').textContent;
          const desc = rssContent.querySelector('description').textContent;
          const items = rssContent.querySelectorAll('item');
          const feed = {
            url,
            title,
            desc,
            items: getFeedItems(items),
          };
          const newChannel = document.createElement('li');
          newChannel.innerHTML = `${feed.title}`;
          channelsElem.appendChild(newChannel);

          const newArticles = feed.items.reduce((acc, item) => `${acc}\n <li>
            <a href="${item.link}" target="_blank">${item.title}</a>
          </li>`, '');
          articlesElem.innerHTML += newArticles;
          this.state.addFeed(url);
          readerForm.feed.value = '';
        }).catch((err) => {
          const alertHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${err.message}. Try again
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
              </button>
              </div>`;
          this.element.querySelector('#error').innerHTML = alertHTML;
        });
      }
    });
  }
}

