const truewsButton = document.querySelector(".truews-mark");
const truewsLetters = "TRUEWS";
const typewriterSound = "assets/sounds/typerwriter.mp3";

if (truewsButton) {
  let currentLetterIndex = 0;

  const playTypewriterClick = () => {
    const audio = new Audio(typewriterSound);
    audio.playbackRate = 0.88 + Math.random() * 0.24;
    audio.volume = 0.78 + Math.random() * 0.22;
    audio.preservesPitch = false;
    audio.webkitPreservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.play().catch((error) => {
      console.warn("Unable to play the TRUEWS typewriter sound.", error);
    });
  };

  truewsButton.addEventListener("click", () => {
    currentLetterIndex = (currentLetterIndex + 1) % truewsLetters.length;
    const letter = truewsLetters[currentLetterIndex];
    truewsButton.textContent = letter;
    truewsButton.setAttribute(
      "aria-label",
      `Cycle TRUEWS letters; current letter ${letter}`,
    );
    playTypewriterClick();
  });
}
