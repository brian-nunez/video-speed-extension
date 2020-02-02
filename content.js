function sleep(time = 10000) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time);
  });
}

// async function main() {
//   let video;
//   do {
//     video = document.querySelector('video');
//     if (!video) {
//       await sleep(2000);
//       continue;
//     }
//     video.playbackRate = 1.8;
//     break;
//   } while(video === null);
// }

function setSpeed({ speed }) {
  document.querySelector('video').playbackRate = speed;
}

chrome.runtime.onMessage.addListener((req, res, next) => {
  switch (req.type) {
    case "setSpeed":
      setSpeed(req);
      break;
    default:
      break;
  }
});
