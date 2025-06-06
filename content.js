let activated = false;

document.addEventListener("click", () => {
  if (activated) return;
  activated = true;

  console.log("👻 JumpScare Mode Activated");

  function isNight() {
    const hour = new Date().getHours();
    return hour >= 19 || hour <= 6; // 7 PM – 6 AM
  }

  function showScare() {
  const scareImages = [
    chrome.runtime.getURL("scare1.png"),
    chrome.runtime.getURL("scare2.png"),
    chrome.runtime.getURL("scare3.png"),
    chrome.runtime.getURL("scare4.png")
  ];

  const scareSounds = [
    chrome.runtime.getURL("scream1.mp3"),
    chrome.runtime.getURL("scream2.mp3"),
    chrome.runtime.getURL("scream3.mp3")
  ];

  const randomImage = scareImages[Math.floor(Math.random() * scareImages.length)];
  const randomSound = scareSounds[Math.floor(Math.random() * scareSounds.length)];

  const img = document.createElement("img");
  img.src = randomImage;
  img.style = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 9999999;
    object-fit: cover;
  `;
  document.body.appendChild(img);

  const audio = new Audio(randomSound);
  audio.play().catch(e => console.warn("🔇 Audio blocked:", e));

  setTimeout(() => {
    img.remove();
  }, 2500);
}


  function scareLoop() {
    chrome.storage.local.get(["active", "nightOnly", "minDelay", "maxDelay"], (data) => {
      if (!data.active) return;

      const min = (data.minDelay ?? 30) * 60 * 1000;
      const max = (data.maxDelay ?? 60) * 60 * 1000;
      const delay = Math.random() * (max - min) + min;

      setTimeout(() => {
        chrome.storage.local.get(["active", "nightOnly"], (cfg) => {
          if (!cfg.active) return;
          if (!cfg.nightOnly || isNight()) {
            showScare();
          } else {
            console.log("🌞 Skipped (not night)");
          }
          scareLoop(); // keep going
        });
      }, delay);
    });
  }

  scareLoop();
}, { once: true });
