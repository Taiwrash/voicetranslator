const nativeTextArea = document.getElementById("text-area-native");
const startTalkingBtn = document.getElementById("start");

//Start Button Listener.
startTalkingBtn.addEventListener("click", () => {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.interimResults = false;
  // recognizer.lang = 'ng-YO';ss

  recognizer.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    nativeTextArea.textContent = transcript;

    if (e.results[0].isFinal) {
      const newTextArea = document.createElement("textarea");
      newTextArea.setAttribute("name", "text");
      newTextArea.setAttribute("id", "language-dropdown");
      // const textDiv = document.getElementById('speaker-lang');
      nativeTextArea.appendChild(newTextArea);
    }
  });

  recognizer.addEventListener("end", recognizer.start);

  recognizer.start();
});

//Translate Button Listener.

const translator = new SpeechSynthesisUtterance();
let languages = [];
// const dropDown = document.querySelector('[id="language-dropdown"]');
const dropDown = document.querySelector(
  '[id="language-dropdown"], [name="native-lang"]'
);
const speedCtrl = document.querySelectorAll('[type="range"], [name="text"]');
const textSearch = document.querySelector('[name="text"]');
const translateBtn = document.getElementById("translate");
const stopBtn = document.getElementById("stop");

// let nativeText;
// nativeText.textContent = nativeTextArea.value;

translator.text = nativeTextArea.value;
function populateVoices() {
  languages = this.getVoices();
  dropDown.innerHTML = languages
    //   .filter(voice => voice.lang.includes('en'))
    .map(
      (voice) =>
        `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )
    .join("");
}

function setVoice() {
  translator.voice = languages.find((voice) => voice.name === this.value);
  toggle();
}

function toggle(startOver = true) {
  speechSynthesis.cancel();
  if (startOver) {
    speechSynthesis.speak(translator);
  }
}

function setOption() {
  translator[this.name] = this.value;
  toggle();
}

speechSynthesis.addEventListener("voiceschanged", populateVoices);
dropDown.addEventListener("change", setVoice);
speedCtrl.forEach((option) => option.addEventListener("change", setOption));
textSearch.addEventListener("load", setOption);
translateBtn.addEventListener("click", toggle);
stopBtn.addEventListener("click", () => toggle(false));
