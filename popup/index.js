const supportedSites = [
  "www.netflix.com/watch",
  "www.youtube.com/watch"
];

function getTab() {
  return new Promise((res, rej) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      ([tab]) => {
        res(tab);
      }
    );
  });
}

function saveData(key, value) {
  return new Promise(res => {
    const data = {};
    data[key] = value;
    chrome.storage.sync.set(data, function(){
      res();
    });
  });
}

function getData(key) {
  return new Promise(res => {
    chrome.storage.sync.get(key, function(value){
      res(value[key]);
    });
  });
}

function isSupportedSite(url) {
  let isSupported = false;
  for (let i of supportedSites) {
    if (url.match(new RegExp(i, 'gi'))) {
      isSupported = true;
    }
  }
  return isSupported;
}

const getLocation = (href) => {
  const l = document.createElement("a");
  l.href = href;
  return l;
};

async function sendMessage(data) {
  const tab = await getTab();
  chrome.tabs.sendMessage(tab.id, data);
}

async function main() {
  const { url } = ({ ...await getTab() });
  const isSupported = isSupportedSite(url);
  const supportClass = isSupported ? 'check' : 'error';
  if (!isSupported) {
    document.querySelector('#supported').classList.add(supportClass);
    document.querySelector('main').classList.add('hide');
    return;
  }
  document.querySelector('#supported').classList.add(supportClass);
  const range = document.querySelector('input[type="range"]');
  const label = document.querySelector('[for="plackbackSpeed"]');
  let defaultSpeed = await getData('speed');
  if (!defaultSpeed) {
    defaultSpeed = 1
  }

  label.innerText = defaultSpeed;
  range.value = `${defaultSpeed}`;
  range.addEventListener('change', async (e) => {
    const speed = Number(e.target.value);
    label.innerText = speed;
    await saveData('speed', speed);
    await sendMessage({ type: 'setSpeed', speed });
  });
}

window.onload = main;