const words = [
    "Premium Bikes",
    "Quality Service",
    "Expert Repairs",
    "Cycling Accessories"
];

let i = 0;
let currentWord = 0;
let isDeleting = false;
const typingSpan = document.querySelector(".typing-text span");

function type() {
    if (!typingSpan) return;
    let fullText = words[currentWord];
    let text = typingSpan.textContent;

    if (!isDeleting) {
      typingSpan.textContent = fullText.substring(0, text.length + 1);
      if (text.length + 1 === fullText.length) {
        isDeleting = true;
        setTimeout(type, 2000);
      } else {
        setTimeout(type, 100);
      }
    } else {
      typingSpan.textContent = text.substring(0, text.length - 1);
      if (text.length - 1 === 0) {
        isDeleting = false;
        currentWord = (currentWord + 1) % words.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, 50);
      }
    }
  }
  
type();