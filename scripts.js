// Application Configuration
const CONFIG = {
  selectors: {
    image: "#shuffleImage",
    caption: "#imageCaption",
    shuffleIcon: "#shuffleIcon",
    scrollTopBtn: "#scrollToTop",
  },
  endpoints: {
    images: "/images.json",
  },
  classes: {
    visible: "visible",
  },
  scroll: {
    threshold: 20,
    behavior: "smooth",
  },
};

// Text Processing Utils
const TextProcessor = {
  patterns: {
    br: /<br\s*\/?>/gi,
    font: /<font[^>]*>(.*?)<\/font>/gi,
    entities: /&lt;|&gt;|&amp;/g,
  },

  entityMap: {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
  },

  format(text) {
    return text
      .replace(this.patterns.br, "\n")
      .replace(this.patterns.font, "$1")
      .replace(this.patterns.entities, (match) => this.entityMap[match]);
  },
};

// DOM Utils
const DOM = {
  elements: {},

  initialize(selectors) {
    Object.entries(selectors).forEach(([key, selector]) => {
      this.elements[key] = document.querySelector(selector);
    });
  },

  setStyles(element, styles) {
    Object.assign(element.style, styles);
  },

  toggleClass(element, className, force) {
    element.classList.toggle(className, force);
  },
};

// Image Shuffler Class
class ImageShuffler {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.isLoading = false;

    // Initialize DOM elements
    DOM.initialize(CONFIG.selectors);

    // Bind methods
    this.handleShuffleClick = this.handleShuffleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    // Start initialization
    this.init();
  }

  async init() {
    try {
      await this.loadImages();
      this.setupEventListeners();
      this.initializeDisplay();
    } catch (error) {
      console.error("Failed to initialize ImageShuffler:", error);
    }
  }

  async loadImages() {
    try {
      const response = await fetch(CONFIG.endpoints.images);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      this.images = data.shuffleImages;
      this.shuffle();

      return true;
    } catch (error) {
      console.error("Error loading images:", error);
      return false;
    }
  }

  shuffle() {
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
    }
    this.currentIndex = Math.floor(Math.random() * this.images.length);
  }

  setupEventListeners() {
    // Image shuffling
    DOM.elements.shuffleIcon.addEventListener("click", this.handleShuffleClick);

    // Scroll handling
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    DOM.elements.scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: CONFIG.scroll.behavior,
      });
    });

    // Set initial caption style
    DOM.setStyles(DOM.elements.caption, {
      whiteSpace: "pre-wrap",
    });
  }

  initializeDisplay() {
    if (this.images.length) {
      this.updateDisplay();
    }
  }

  updateDisplay() {
    if (this.isLoading || !this.images.length) return;

    const { src, alt, caption } = this.images[this.currentIndex];

    // Start loading new image
    this.isLoading = true;
    const tempImage = new Image();

    tempImage.onload = () => {
      DOM.elements.image.src = src;
      DOM.elements.image.alt = alt;
      DOM.elements.caption.textContent = TextProcessor.format(caption);
      this.isLoading = false;
    };

    tempImage.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      this.isLoading = false;
    };

    tempImage.src = src;
  }

  handleShuffleClick() {
    if (this.isLoading) return;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateDisplay();
  }

  handleScroll() {
    const scrolled =
      document.documentElement.scrollTop > CONFIG.scroll.threshold ||
      document.body.scrollTop > CONFIG.scroll.threshold;

    DOM.toggleClass(
      DOM.elements.scrollTopBtn,
      CONFIG.classes.visible,
      scrolled
    );
  }
}

// Initialize the application when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ImageShuffler();
});
