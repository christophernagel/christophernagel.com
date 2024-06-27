const images = [
  "images/AMPP.png",
  "images/therasurf.jpg",
  "images/toolbox.png",
];
let currentIndex = -1;

function shuffleImage() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * images.length);
  } while (newIndex === currentIndex);

  currentIndex = newIndex;
  document.getElementById("shuffleImage").src = images[currentIndex];
}
