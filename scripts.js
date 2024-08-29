// Welcome Image Shuffler
let images = [];
let currentImageIndex = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function formatCaption(caption) {
  return caption
    .replace(/<br\s*\/?>/gi, "\n") // Replace <br> tags with newlines
    .replace(/<font[^>]*>(.*?)<\/font>/gi, "$1") // Remove font tags, keep content
    .replace(/&lt;/g, "<") // Replace HTML entities
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function updateImage() {
  if (images.length === 0) return;

  const img = document.getElementById("shuffleImage");
  const caption = document.getElementById("imageCaption");

  const { src, alt, caption: imageCaption } = images[currentImageIndex];

  img.src = src;
  img.alt = alt;
  caption.textContent = formatCaption(imageCaption);
  caption.style.whiteSpace = "pre-wrap"; // Preserve formatting
}

function handleShuffleClick() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateImage();
}

// Fetch the JSON file
fetch("/images.json")
  .then((response) => response.json())
  .then((data) => {
    images = data.shuffleImages;
    shuffleArray(images);
    currentImageIndex = Math.floor(Math.random() * images.length);
    updateImage();

    document
      .getElementById("shuffleIcon")
      .addEventListener("click", handleShuffleClick);
  })
  .catch((error) => console.error("Error loading images:", error));

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
