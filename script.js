"use strict";

//selected html

const onOffSwitch = document.querySelector(".on-off-switch");
const display = document.querySelector(".display");
const keysEl = document.querySelectorAll(".key");
const soundText = document.querySelectorAll(".sound");
const lofiButton = document.querySelector(".lofi-button");
const verbButton = document.querySelector(".verb-button");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const kitName = document.querySelector(".selected-kit");
const arrowUp = document.querySelector(".switch");
const soundNames = document.querySelectorAll(".sound");

// On/of switch

let on = false;

onOffSwitch.addEventListener("click", () => {
  onOffSwitch.classList.toggle("switch-on");
  display.classList.toggle("display-on");
  lofiButton.classList.toggle("lofi-machine-on");
  verbButton.classList.toggle("lofi-machine-on");
  keysEl.forEach((el, i) => {
    setTimeout(() => {
      el.classList.toggle("keyOn");
    }, i * 50);
  });
  soundText.forEach((el, i) => {
    setTimeout(() => {
      el.classList.toggle("soundOn");
    }, i * 50);
  });
  if (on === false) {
    on = true;
  } else {
    on = false;
  }
  console.log(on);
  audioCtx.resume().then(() => {
    console.log("Playback resumed successfully");
    console.log(audioCtx.state);
  });
});

//samples

const kitOnekick = new Audio();
kitOnekick.src = "sounds/808-kick.wav";
const kitOneSnare = new Audio();
kitOneSnare.src = "sounds/808-snare.wav";
const kitOneHihat = new Audio();
kitOneHihat.src = "sounds/808-hihat.wav";
const kitOneHihatOpen = new Audio();
kitOneHihatOpen.src = "sounds/808-hihat-open.wav";
const kitOneConga = new Audio();
kitOneConga.src = "sounds/808-mid-conga.wav";
const kitOneCowbell = new Audio();
kitOneCowbell.src = "sounds/808-cowbell.wav";

const kitTwokick = new Audio();
kitTwokick.src = "sounds/909-Kick.wav";
const kitTwoSnare = new Audio();
kitTwoSnare.src = "sounds/909-Snare-Mid.wav";
const kitTwoHihat = new Audio();
kitTwoHihat.src = "sounds/909-Hihat-closed.wav";
const kitTwoRide = new Audio();
kitTwoRide.src = "sounds/909-Hihat-Ride.wav";
const kitTwoTom = new Audio();
kitTwoTom.src = "sounds/909-Mid-Tom-Mid.wav";
const kitTwoCrash = new Audio();
kitTwoCrash.src = "sounds/909-Hihat-Crash.wav";

const kitThreekick = new Audio();
kitThreekick.src = "sounds/707-Kick.wav";
const kitThreeSnare = new Audio();
kitThreeSnare.src = "sounds/707-Snare.wav";
const kitThreeHihat = new Audio();
kitThreeHihat.src = "sounds/707-Hihat-Closed.wav";
const kitThreeHihatOpen = new Audio();
kitThreeHihatOpen.src = "sounds/707-Hihat-Open.wav";
const kitThreeClap = new Audio();
kitThreeClap.src = "sounds/707-Clap.wav";
const kitThreeRim = new Audio();
kitThreeRim.src = "sounds/707-Rim.wav";

const allAudio = [
  kitOnekick,
  kitOneSnare,
  kitOneHihat,
  kitOneHihatOpen,
  kitOneConga,
  kitOneCowbell,
  kitTwokick,
  kitTwoSnare,
  kitTwoHihat,
  kitTwoRide,
  kitTwoTom,
  kitTwoCrash,
  kitThreekick,
  kitThreeSnare,
  kitThreeHihat,
  kitThreeHihatOpen,
  kitThreeClap,
  kitThreeRim,
];

//kits

const kits = [
  {
    name: "808",
    slot1: ["kick", kitOnekick],
    slot2: ["snare", kitOneSnare],
    slot3: ["hihat", kitOneHihat],
    slot4: ["hihatOH", kitOneHihatOpen],
    slot5: ["conga", kitOneConga],
    slot6: ["cowbell", kitOneCowbell],
  },
  {
    name: "909",
    slot1: ["kick", kitTwokick],
    slot2: ["snare", kitTwoSnare],
    slot3: ["hihat", kitTwoHihat],
    slot4: ["ride", kitTwoRide],
    slot5: ["tom", kitTwoTom],
    slot6: ["crash", kitTwoCrash],
  },
  {
    name: "707",
    slot1: ["kick", kitThreekick],
    slot2: ["snare", kitThreeSnare],
    slot3: ["hihat", kitThreeHihat],
    slot4: ["hihatOH", kitThreeHihatOpen],
    slot5: ["clap", kitThreeClap],
    slot6: ["rim", kitThreeRim],
  },
];

//reverb + lofi filter

const impulseResponse = (duration, decay) => {
  const length = audioCtx.sampleRate * duration;
  const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  const myImpulse = impulse.getChannelData(0);
  for (let i = 0; i < length; i++) {
    myImpulse[i] = (2 * Math.random() - 1) * Math.pow(1 - i / length, decay);
  }
  return impulse;
};
let verbOn = false;
verbButton.addEventListener("click", () => {
  reverbSwitch();
});

// create audio context
const audioCtx = new window.AudioContext();
console.log(audioCtx.state);

const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();

//reverb settings + create reverb
let impulse = impulseResponse(0.8, 2);
const convolver = new ConvolverNode(audioCtx, { buffer: impulse });

// connect the nodes
allAudio.forEach((audio) => {
  let source = audioCtx.createMediaElementSource(audio);
  source.connect(biquadFilter);
  biquadFilter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  // connect reverb
  source.connect(convolver);
  gainNode.connect(audioCtx.destination);
});

// function to connect + disconnect reverb nodes on click

const reverbSwitch = () => {
  verbButton.classList.toggle("lofi-button-on");
  if (verbOn === false) {
    convolver.connect(gainNode);
    verbOn = true;
  } else if (verbOn === true) {
    convolver.disconnect(gainNode);
    verbOn = false;
  }
};

//initialize filter freq to 20000hz

biquadFilter.type = "lowpass";
biquadFilter.frequency.value = 20000;
biquadFilter.gain.value = 25;

//change filter freq on click

let freq = 20000;
let lofiOn = false;
lofiButton.addEventListener("click", () => {
  lofiButton.classList.toggle("lofi-button-on");
  if (lofiOn === false) {
    freq = 2000;
    lofiOn = true;
  } else if (lofiOn === true) {
    freq = 20000;
    lofiOn = false;
  }

  // change filter freq  filter

  biquadFilter.type = "lowpass";
  biquadFilter.frequency.value = freq;
  console.log(freq);
  biquadFilter.gain.value = 25;
});

//change kit + update sample names

const kitPosition = () => {
  if (i >= kits.length) {
    return;
  } else {
    arrowUp.innerHTML = `Kit 0${i + 1}`;
    kitName.innerHTML = kits[i].name;
    // fix later
    const keyNames = Object.keys(kits[i]);
    console.log(keyNames);
    console.log(keyNames[i + 1]);
    console.log(kits[i].slot3[0]);

    soundNames.forEach((soundName, j) => {
      soundName.innerHTML = keyNames[j + 1];
    });
  }
};

//update kit position
let i = 0;
kitPosition();

arrowRight.addEventListener("click", () => {
  if (on === false) {
    return;
  }
  if (i === kits.length - 1) {
    return;
  }
  i++;
  kitPosition();
});

arrowLeft.addEventListener("click", () => {
  if (on === false) {
    return;
  }
  if (i === 0) {
    return;
  }
  i--;
  kitPosition();
});

//play kit

window.addEventListener("keydown", (e) => {
  if (on === false) {
    alert("turn on");
    return;
  }
  const key = document.querySelector('.key[data-key="' + e.keyCode + '"]');
  key.classList.add("playing");

  if (e.keyCode === 65) {
    kits[i].slot1[1].currentTime = 0;
    kits[i].slot1[1].play();
  }
  if (e.keyCode === 83) {
    kits[i].slot2[1].currentTime = 0;
    kits[i].slot2[1].play();
  }
  if (e.keyCode === 68) {
    kits[i].slot3[1].currentTime = 0;
    kits[i].slot3[1].play();
  }
  if (e.keyCode === 70) {
    kits[i].slot4[1].currentTime = 0;
    kits[i].slot4[1].play();
  }
  if (e.keyCode === 71) {
    kits[i].slot5[1].currentTime = 0;
    kits[i].slot5[1].play();
  }
  if (e.keyCode === 72) {
    kits[i].slot6[1].currentTime = 0;
    kits[i].slot6[1].play();
  }
});

const keys = document.querySelectorAll(".key");

keys.forEach((key) => {
  key.addEventListener("transitionend", () => {
    key.classList.remove("playing");
  });
});
