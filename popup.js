const toggleButton = document.getElementById("toggleButton");
const nightOnlyToggle = document.getElementById("nightOnlyToggle");
const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const rangeLabel = document.getElementById("rangeLabel");

chrome.storage.local.get(["active", "nightOnly", "minDelay", "maxDelay"], (data) => {
  toggleButton.classList.toggle("active", data.active);
  toggleButton.textContent = data.active ? "Stop" : "Start";
  nightOnlyToggle.checked = data.nightOnly ?? false;
  minRange.value = data.minDelay ?? 30;
  maxRange.value = data.maxDelay ?? 60;
  updateRangeLabel();
});

toggleButton.addEventListener("click", () => {
  const isActive = !toggleButton.classList.contains("active");
  
  // Immediately update UI first
  toggleButton.classList.toggle("active", isActive);
  toggleButton.textContent = isActive ? "Stop" : "Start";

  // Then save state
  chrome.storage.local.set({ active: isActive });
});


[minRange, maxRange].forEach(el => {
  el.addEventListener("input", () => {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);
    if (minVal > maxVal) [minVal, maxVal] = [maxVal, minVal];
    chrome.storage.local.set({ minDelay: minVal, maxDelay: maxVal });
    updateRangeLabel(minVal, maxVal);
  });
});

function updateRangeLabel(min = minRange.value, max = maxRange.value) {
  rangeLabel.textContent = `${min}–${max} min`;
}
