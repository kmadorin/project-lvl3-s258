import RssReaderView from './view';
import State from './state';

export default () => {
  const appContainer = document.getElementById('app');
  const appState = new State();
  const appView = new RssReaderView(appState);

  appContainer.innerHTML = '';
  appContainer.appendChild(appView.element);
};

