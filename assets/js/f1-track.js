const f1Artwork = document.querySelector(".project-art-f1");
const trackLoop = f1Artwork?.querySelector(".track-loop");
const trackDot = f1Artwork?.querySelector(".track-dot");

if (f1Artwork && trackLoop && trackDot) {
  const trackControl = f1Artwork.querySelector(".track-control");
  const trackControlIcon = trackControl?.querySelector(".track-control-icon");
  let angle = -Math.PI / 2 + (window.scrollY / 1200) * Math.PI * 2;
  let isPlaying = false;
  let isDragging = false;
  let isPositionCustomized = false;
  let previousFrameTime = null;
  let animationFrameId = null;
  let positionFrameRequested = false;

  const getTrackGeometry = () => {
    const artworkBounds = f1Artwork.getBoundingClientRect();
    const loopBounds = trackLoop.getBoundingClientRect();
    const loopStyle = window.getComputedStyle(trackLoop);
    const loopWidth = Number.parseFloat(loopStyle.width);
    const loopHeight = Number.parseFloat(loopStyle.height);
    const rotation = -15 * (Math.PI / 180);
    const horizontalRadius = loopWidth / 2 - 8;
    const verticalRadius = loopHeight / 2 - 8;
    const centerX = loopBounds.left + loopBounds.width / 2 - artworkBounds.left;
    const centerY = loopBounds.top + loopBounds.height / 2 - artworkBounds.top;

    return { artworkBounds, centerX, centerY, horizontalRadius, verticalRadius, rotation };
  };

  const updateTrackPosition = () => {
    const { centerX, centerY, horizontalRadius, verticalRadius, rotation } = getTrackGeometry();
    const x = horizontalRadius * Math.cos(angle);
    const y = verticalRadius * Math.sin(angle);
    const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation);
    const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation);
    const position = (Math.round(((angle + Math.PI / 2) / (Math.PI * 2)) * 360) % 360 + 360) % 360;

    trackDot.style.left = `${centerX + rotatedX - trackDot.offsetWidth / 2}px`;
    trackDot.style.top = `${centerY + rotatedY - trackDot.offsetHeight / 2}px`;
    trackDot.setAttribute("aria-valuenow", String(position));
    trackDot.setAttribute("aria-valuetext", `Track position ${position} degrees`);
  };

  const schedulePositionUpdate = () => {
    if (positionFrameRequested) {
      return;
    }

    positionFrameRequested = true;
    window.requestAnimationFrame(() => {
      updateTrackPosition();
      positionFrameRequested = false;
    });
  };

  const animateTrack = (timestamp) => {
    animationFrameId = null;
    if (!isPlaying || isDragging) {
      return;
    }

    if (previousFrameTime !== null) {
      angle += (timestamp - previousFrameTime) * 0.0015;
    }
    previousFrameTime = timestamp;
    updateTrackPosition();
    animationFrameId = window.requestAnimationFrame(animateTrack);
  };

  const setPlaying = (playing) => {
    isPlaying = playing;
    previousFrameTime = null;
    trackControl?.setAttribute("aria-label", playing ? "Pause track animation" : "Play track animation");
    trackControl?.setAttribute("aria-pressed", String(playing));
    if (trackControlIcon) {
      trackControlIcon.textContent = playing ? "Ⅱ" : "▶";
    }

    if (!playing && animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else if (playing) {
      isPositionCustomized = true;
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(animateTrack);
      }
    }
  };

  const setAngleFromPointer = (event) => {
    const { artworkBounds, centerX, centerY, horizontalRadius, verticalRadius, rotation } = getTrackGeometry();
    const pointerX = event.clientX - artworkBounds.left - centerX;
    const pointerY = event.clientY - artworkBounds.top - centerY;
    const x = pointerX * Math.cos(rotation) + pointerY * Math.sin(rotation);
    const y = -pointerX * Math.sin(rotation) + pointerY * Math.cos(rotation);

    angle = Math.atan2(y / verticalRadius, x / horizontalRadius);
    updateTrackPosition();
  };

  trackControl?.addEventListener("click", () => setPlaying(!isPlaying));
  trackDot.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    trackDot.focus();
    isDragging = true;
    isPositionCustomized = true;
    setPlaying(false);
    trackDot.setPointerCapture(event.pointerId);
    setAngleFromPointer(event);
  });
  trackDot.addEventListener("pointermove", (event) => {
    if (isDragging) {
      setAngleFromPointer(event);
    }
  });
  trackDot.addEventListener("pointerup", (event) => {
    isDragging = false;
    if (trackDot.hasPointerCapture(event.pointerId)) {
      trackDot.releasePointerCapture(event.pointerId);
    }
  });
  trackDot.addEventListener("pointercancel", () => {
    isDragging = false;
  });
  trackDot.addEventListener("keydown", (event) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1
        : 0;
    if (event.key === "Home") {
      angle = -Math.PI / 2;
    } else if (event.key === "End") {
      angle = -Math.PI / 2 + (359 / 360) * Math.PI * 2;
    } else if (direction) {
      angle += direction * (Math.PI / 18);
    } else {
      return;
    }

    event.preventDefault();
    isPositionCustomized = true;
    setPlaying(false);
    updateTrackPosition();
  });

  window.addEventListener("scroll", () => {
    if (!isPlaying && !isPositionCustomized) {
      angle = -Math.PI / 2 + (window.scrollY / 1200) * Math.PI * 2;
      schedulePositionUpdate();
    }
  }, { passive: true });
  window.addEventListener("resize", schedulePositionUpdate);
  updateTrackPosition();
}
