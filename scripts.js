// Welcome Image Shuffler
let images;
let currentImageIndex = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateImage() {
  if (!images || images.length === 0) return;

  const img = document.getElementById("shuffleImage");
  const caption = document.getElementById("imageCaption");

  img.src = images[currentImageIndex].src;
  img.alt = images[currentImageIndex].alt;
  caption.innerHTML = images[currentImageIndex].caption;
}

// Fetch the JSON file
fetch("/images.json")
  .then((response) => response.json())
  .then((data) => {
    images = shuffleArray(data.shuffleImages);
    currentImageIndex = Math.floor(Math.random() * images.length);
    updateImage();

    // Add event listener after images are loaded
    document
      .getElementById("shuffleIcon")
      .addEventListener("click", function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
      });
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
