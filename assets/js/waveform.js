const pianoArtwork = document.querySelector(".project-art-piano");
const waveformBars = pianoArtwork?.querySelectorAll(".waveform i");

if (pianoArtwork && waveformBars?.length) {
  const clickTimers = new Map();
  const setBarEnergy = (bar, property, energy) => {
    bar.style.setProperty(property, String(energy));
  };

  const reactToPointer = (clientX, property, strength, spread) => {
    const waveform = pianoArtwork.querySelector(".waveform");
    const bounds = waveform.getBoundingClientRect();
    const position = (clientX - bounds.left) / bounds.width;

    waveformBars.forEach((bar, index) => {
      const barPosition = index / (waveformBars.length - 1);
      const distance = Math.abs(position - barPosition);
      const energy = Math.max(0, 1 - distance / spread) * strength;
      setBarEnergy(bar, property, energy);
    });
  };

  pianoArtwork.addEventListener("pointermove", (event) => {
    reactToPointer(event.clientX, "--pointer-energy", 0.9, 0.3);
  });

  pianoArtwork.addEventListener("pointerleave", () => {
    waveformBars.forEach((bar) => {
      setBarEnergy(bar, "--pointer-energy", 0);
    });
  });

  pianoArtwork.addEventListener("click", (event) => {
    reactToPointer(event.clientX, "--click-energy", 1.5, 0.5);

    waveformBars.forEach((bar) => {
      window.clearTimeout(clickTimers.get(bar));
      clickTimers.set(
        bar,
        window.setTimeout(() => {
          setBarEnergy(bar, "--click-energy", 0);
          clickTimers.delete(bar);
        }, 650),
      );
    });
  });
}
