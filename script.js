const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomeText = document.getElementById('welcome-text');
const loadingContainer = document.getElementById('loading-container');
const navbar = document.getElementById('navbar');


const videoBackground = document.getElementById('video-background');

if (videoBackground) {
  videoBackground.playbackRate = 1; // 0.75x speed for slower background video
}
// List of greetings to cycle through (reduced from original)
const greetings = [
  "Welcome", "Bienvenido", "ようこそ", "환영합니다", "नमस्ते"
];

// Messages to display during loading (original messages)
const loadingMessages = [
  "Initializing systems...",
  "Gathering pixels...",
  "Composing magic...",
  "Almost ready..."
];

let greetingIndex = 0;
let greetingInterval;
// Duration for each greeting to be visible (300ms visible + 300ms fade out)
const GREETING_DURATION = 600;

/**
 * Cycles through greetings on the overlay.
 * The cycle stops after a total specified duration.
 * @param {number} totalDuration - The total duration in milliseconds for the greeting cycle.
 */
function fadeGreetingsOnceCycle(totalDuration) {
  welcomeText.textContent = greetings[greetingIndex];
  welcomeText.style.opacity = '1';

  setTimeout(() => {
    welcomeText.style.opacity = '0';
  }, GREETING_DURATION / 2);

  greetingInterval = setTimeout(() => {
    greetingIndex++;
    if (greetingIndex < greetings.length && (greetingIndex * GREETING_DURATION / 2) < totalDuration) {
      fadeGreetingsOnceCycle(totalDuration);
    } else {
      welcomeText.style.opacity = '0';
    }
  }, GREETING_DURATION / 2);
}

let messageIndex = 0;
let charIndex = 0;
let currentMessageElement = null;

// New constants for timing adjustments
const CHAR_TYPING_DELAY = 15; // Time in ms for each character to appear
const DELAY_BETWEEN_MESSAGES = 150; // Time in ms between messages

/**
 * Types out loading messages sequentially.
 */
function typeLoadingMessages() {
  if (messageIndex < loadingMessages.length) {
    if (charIndex === 0) {
      currentMessageElement = document.createElement('div');
      loadingContainer.appendChild(currentMessageElement);
    }

    if (charIndex < loadingMessages[messageIndex].length) {
      currentMessageElement.textContent += loadingMessages[messageIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeLoadingMessages, CHAR_TYPING_DELAY); // Use new constant
    } else {
      currentMessageElement.style.color = 'var(--color-light-secondary)'; // Keep it lighter grey
      charIndex = 0;
      messageIndex++;
      setTimeout(typeLoadingMessages, DELAY_BETWEEN_MESSAGES); // Use new constant
    }
  }
}

// Recalculate totalLoadingTime based on original messages and new timing constants
const totalLoadingTime =
  loadingMessages.reduce((acc, msg, index) => {
    const typingTime = msg.length * CHAR_TYPING_DELAY;
    // Add delay only if it's not the last message
    const delayAfterMessage = (index < loadingMessages.length - 1) ? DELAY_BETWEEN_MESSAGES : 0;
    return acc + typingTime + delayAfterMessage;
  }, 0);

console.log("Calculated totalLoadingTime:", totalLoadingTime, "ms"); // For verification

fadeGreetingsOnceCycle(totalLoadingTime);
typeLoadingMessages();

setTimeout(() => {
  welcomeOverlay.classList.add('fade-out');
  clearTimeout(greetingInterval);
}, totalLoadingTime);

welcomeOverlay.addEventListener('transitionend', () => {
  if (welcomeOverlay.classList.contains('fade-out')) {
    if (navbar) {
      navbar.classList.add('visible');

      function navbarTransitionEndHandler() {
        if (navbar.classList.contains('visible')) {
          welcomeOverlay.style.display = 'none';
          navbar.removeEventListener('transitionend', navbarTransitionEndHandler);
        }
      }
      navbar.addEventListener('transitionend', navbarTransitionEndHandler);
    } else {
      welcomeOverlay.style.display = 'none';
    }
  }
});


// Scroll to section logic with active link highlighting
document.querySelectorAll('nav a, .site-title, .scroll-down').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));

    // Add active class to the clicked nav link (if it's a nav link)
    if (this.tagName === 'A' && this.closest('nav')) {
      this.classList.add('active');
    }

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 10; // Adjusted offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});


// Highlight active navbar link on scroll
// Filter out the 'Skills' section if it's removed from the HTML
const sections = Array.from(document.querySelectorAll('main section')).filter(section => section.id !== 'skills');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const scrollThreshold = window.innerHeight * 0.3; // Highlight when section is 30% into view

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.clientHeight;

    // Check if the section's top is visible AND the user has scrolled past its top
    // But also check if its bottom is not yet completely out of view.
    // This logic makes sure the link is active when the section is largely in view.
    if (pageYOffset >= sectionTop - navbarHeight - scrollThreshold && pageYOffset < sectionBottom - navbarHeight - scrollThreshold) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// Existing code...

// Project Image Gallery Logic
document.querySelectorAll('.project-item').forEach(projectItem => {
    const imageContainer = projectItem.querySelector('.project-image-container');
    const mainImage = imageContainer.querySelector('.project-main-image');
    const prevArrow = imageContainer.querySelector('.prev-arrow');
    const nextArrow = imageContainer.querySelector('.next-arrow');

    if (imageContainer && mainImage && prevArrow && nextArrow) {
        const images = imageContainer.getAttribute('data-images').split(',');
        let currentImageIndex = 0;

        // Function to update the image source
        const updateImage = () => {
            mainImage.src = images[currentImageIndex];
            mainImage.alt = `${projectItem.querySelector('h3').textContent} Project Image ${currentImageIndex + 1}`;
        };

        // Event listener for previous arrow
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent project item click from firing
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
            updateImage();
        });

        // Event listener for next arrow
        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent project item click from firing
            currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
            updateImage();
        });

        // Show/Hide arrows on hover
        imageContainer.addEventListener('mouseenter', () => {
            if (images.length > 1) { // Only show arrows if there's more than one image
                prevArrow.style.opacity = '1';
                nextArrow.style.opacity = '1';
            }
        });

        imageContainer.addEventListener('mouseleave', () => {
            prevArrow.style.opacity = '0';
            nextArrow.style.opacity = '0';
        });

        // Initial update in case the first image isn't loaded by default src
        updateImage();
    }
});