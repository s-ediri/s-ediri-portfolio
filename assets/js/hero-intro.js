const greeting = document.querySelector(".site-shell .hero-greeting");
const intro = document.querySelector("[data-hero-intro]");

if (
  greeting
  && intro
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  && typeof Element.prototype.animate === "function"
) {
  const introText = intro.querySelector(".hero-greeting-text");
  const introTextAnimationOptions = {
    duration: 1800,
    easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    fill: "forwards",
  };
  const root = document.documentElement;

  let hasStarted = false;
  let startTimer;
  const startIntro = () => {
    if (hasStarted) {
      return;
    }

    hasStarted = true;
    window.clearTimeout(startTimer);
    document.removeEventListener("click", startIntro);

    const destination = greeting.getBoundingClientRect();
    const destinationStyle = window.getComputedStyle(greeting);
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
          backgroundColor: "#292f30",
          borderColor: "#292f30",
          boxShadow: "none",
          color: "#fff",
        },
        {
          top: `${destination.top}px`,
          left: `${destination.left}px`,
          width: `${destination.width}px`,
          height: `${destination.height}px`,
          padding: destinationStyle.padding,
          borderRadius: destinationStyle.borderRadius,
          fontSize: destinationStyle.fontSize,
          backgroundColor: destinationStyle.backgroundColor,
          borderColor: destinationStyle.borderColor,
          boxShadow: destinationStyle.boxShadow,
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
      root.classList.remove("hero-intro-active");
    });
  };

  document.addEventListener("click", startIntro);
  startTimer = window.setTimeout(startIntro, 2000);
}
