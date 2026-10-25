const greeting = document.querySelector(".hero-greeting");

if (
  greeting
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  && typeof Element.prototype.animate === "function"
) {
  const destination = greeting.getBoundingClientRect();
  const destinationStyle = window.getComputedStyle(greeting);
  const intro = greeting.cloneNode(true);
  const introText = intro.querySelector(".hero-greeting-text");
  const introTextAnimationOptions = {
    duration: 1800,
    easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    fill: "forwards",
  };
  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  const previousBodyPaddingRight = document.body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - root.clientWidth;
  const bodyPaddingRight = Number.parseFloat(
    window.getComputedStyle(document.body).paddingRight,
  );

  intro.classList.add("hero-greeting--intro");
  intro.setAttribute("aria-hidden", "true");
  introText.style.clipPath = "circle(0% at 50% 50%)";
  intro.style.visibility = "hidden";
  document.body.append(intro);

  let hasStarted = false;
  let hasRevealed = false;
  let startTimer;
  let waveTimer;
  const revealIntro = () => {
    if (hasRevealed) {
      return;
    }

    hasRevealed = true;
    window.clearTimeout(waveTimer);
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }
    root.style.overflow = "hidden";
    greeting.style.visibility = "hidden";
    intro.style.visibility = "visible";

    introText.animate(
      [
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(150% at 50% 50%)" },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );
  };

  const startIntro = () => {
    if (hasStarted) {
      return;
    }

    hasStarted = true;
    window.clearTimeout(startTimer);
    document.removeEventListener("click", startIntro);
    revealIntro();

    const animation = intro.animate(
      [
        {
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
          padding: "16px",
          borderRadius: "0px",
          fontSize: "clamp(16px, 7vw, 84px)",
        },
        {
          top: `${destination.top}px`,
          left: `${destination.left}px`,
          width: `${destination.width}px`,
          height: `${destination.height}px`,
          padding: destinationStyle.padding,
          borderRadius: destinationStyle.borderRadius,
          fontSize: destinationStyle.fontSize,
        },
      ],
      introTextAnimationOptions,
    );

    introText.animate(
      [
        {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        {
          top: destinationStyle.paddingTop,
          left: destinationStyle.paddingLeft,
          transform: "none",
        },
      ],
      introTextAnimationOptions,
    );

    animation.addEventListener("finish", () => {
      intro.remove();
      greeting.style.visibility = "";
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    });
  };

  document.addEventListener("click", startIntro);
  waveTimer = window.setTimeout(revealIntro, 500);
  startTimer = window.setTimeout(startIntro, 2000);
}
