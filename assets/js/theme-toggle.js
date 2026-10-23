const themeToggle = document.querySelector("[data-theme-toggle]");
const themeStorageKey = "s-ediri-portfolio-theme";
const themeRoot = document.documentElement;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

let isDarkTheme = prefersDark.matches;

try {
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  if (savedTheme === "dark" || savedTheme === "light") {
    isDarkTheme = savedTheme === "dark";
  }
} catch (error) {
  console.warn("Unable to read the saved theme preference.", error);
}

function applyTheme() {
  themeRoot.dataset.darkMode = String(isDarkTheme);
  themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isDarkTheme ? "light" : "dark"} theme`,
  );
}

applyTheme();

themeToggle.addEventListener("click", () => {
  isDarkTheme = !isDarkTheme;
  applyTheme();

  try {
    window.localStorage.setItem(themeStorageKey, isDarkTheme ? "dark" : "light");
  } catch (error) {
    console.warn("Unable to save the theme preference.", error);
  }
});
