// Welcome Image Shuffler

let images = [];
let currentImageIndex = 0;

const imgElement = document.getElementById("shuffleImage");
const captionElement = document.getElementById("imageCaption");
const shuffleIconElement = document.getElementById("shuffleIcon");

// Regular expressions and entity mapping
const brRegex = /<br\s*\/?>/gi;
const fontRegex = /<font[^>]*>(.*?)<\/font>/gi;
const entityMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
};
const entityRegex = /&lt;|&gt;|&amp;/g;

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to format the image caption
function formatCaption(caption) {
  return caption
    .replace(brRegex, "\n")
    .replace(fontRegex, "$1")
    .replace(entityRegex, (match) => entityMap[match]);
}

// Function to update the displayed image and caption
function updateImage() {
  if (!images.length) return;

  const { src, alt, caption } = images[currentImageIndex];
  imgElement.src = src;
  imgElement.alt = alt;
  captionElement.textContent = formatCaption(caption);
}

// Event handler for shuffle icon click
function handleShuffleClick() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateImage();
}

// Initialization function
async function init() {
  try {
    const response = await fetch("/images.json");
    const data = await response.json();

    images = data.shuffleImages;
    shuffleArray(images);
    currentImageIndex = Math.floor(Math.random() * images.length);
    updateImage();

    shuffleIconElement.addEventListener("click", handleShuffleClick);

    // Set caption white-space style once
    captionElement.style.whiteSpace = "pre-wrap";
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

// Start the application
init();

// Scroll to top functionality
const scrollToTopBtn = document.getElementById("scrollToTop");

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

window.onscroll = scrollFunction;

scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
