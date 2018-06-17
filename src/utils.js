import axios from 'axios';

export const createElement = (template) => {
  const outer = document.createElement('div');
  outer.innerHTML = template;
  return outer;
};

export const getFeedContent = url => axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
  .then(res => res.data)
  .then((data) => {
    const parser = new DOMParser();
    const rssContent = parser.parseFromString(data, 'application/xml');
    if (rssContent.children[0].matches('parsererror')) {
      return Promise.reject(new Error('Error while parsing XML document'));
    }
    return rssContent;
  });

export const getFeedItems = items => Array.prototype.map.call(items, (item) => {
  const attributes = ['title', 'description', 'link', 'guid'];
  const itemAttrs = attributes.reduce((acc, value) => {
    const attr = { [value]: item.querySelector(`${value}`).textContent };
    return { ...acc, ...attr };
  }, {});
  return itemAttrs;
});

