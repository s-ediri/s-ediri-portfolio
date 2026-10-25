const f1Artwork = document.querySelector(".project-art-f1");
const trackLoop = f1Artwork?.querySelector(".track-loop");
const trackDot = f1Artwork?.querySelector(".track-dot");

if (f1Artwork && trackLoop && trackDot) {
  let frameRequested = false;

  const positionTrackDot = () => {
    const artworkBounds = f1Artwork.getBoundingClientRect();
    const loopBounds = trackLoop.getBoundingClientRect();
    const loopStyle = window.getComputedStyle(trackLoop);
    const loopWidth = Number.parseFloat(loopStyle.width);
    const loopHeight = Number.parseFloat(loopStyle.height);
    const rotation = -15 * (Math.PI / 180);
    const angle = -Math.PI / 2 + (window.scrollY / 1200) * Math.PI * 2;
    const horizontalRadius = loopWidth / 2 - 8;
    const verticalRadius = loopHeight / 2 - 8;
    const x = horizontalRadius * Math.cos(angle);
    const y = verticalRadius * Math.sin(angle);
    const centerX = loopBounds.left + loopBounds.width / 2 - artworkBounds.left;
    const centerY = loopBounds.top + loopBounds.height / 2 - artworkBounds.top;
    const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation);
    const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation);

    trackDot.style.left = `${centerX + rotatedX - trackDot.offsetWidth / 2}px`;
    trackDot.style.top = `${centerY + rotatedY - trackDot.offsetHeight / 2}px`;
    frameRequested = false;
  };

  const schedulePositionUpdate = () => {
    if (frameRequested) {
      return;
    }

    frameRequested = true;
    window.requestAnimationFrame(positionTrackDot);
  };

  window.addEventListener("scroll", schedulePositionUpdate, { passive: true });
  window.addEventListener("resize", schedulePositionUpdate);
  positionTrackDot();
}
