$(document).ready(function () {
  $('.fade-in').each(function (i) {
    $(this).delay(i * 120).queue(function (next) {
      $(this).addClass('visible');
      next();
    });
  });
});

window.addEventListener("load", function () {

  const lightbox = document.getElementById("euroLightbox");
  const img = document.getElementById("elb-img");
  const overlay = document.querySelector(".elb-overlay");
  const closeBtn = document.querySelector(".elb-close");
  const prevBtn = document.querySelector(".elb-prev");
  const nextBtn = document.querySelector(".elb-next");
  const counter = document.querySelector(".elb-counter");

  if (!lightbox || !img || !closeBtn || !prevBtn || !nextBtn) {
    console.error("Lightbox elements not found");
    return;
  }

  let gallery = [];
  let current = 0;
  let scale = 1;
  let posX = 0;
  let posY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  // Abrir por proyecto (galería independiente)
  document.querySelectorAll(".divProject").forEach(project => {
    const images = project.querySelectorAll(".divProImgs img");

    images.forEach((image, index) => {
      image.style.cursor = "zoom-in";

      image.addEventListener("click", () => {
        gallery = Array.from(images);
        current = index;
        open();
      });
    });
  });

  function open() {
    updateImage();
    preload();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
    resetTransform();
  }

  function updateImage() {
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = gallery[current].src;
      counter.textContent = `${current + 1} / ${gallery.length}`;
      img.style.opacity = 1;
    }, 150);
    resetTransform();
  }

  function next() {
    current = (current + 1) % gallery.length;
    updateImage();
  }

  function prev() {
    current = (current - 1 + gallery.length) % gallery.length;
    updateImage();
  }

  function preload() {
    gallery.forEach(i => {
      const temp = new Image();
      temp.src = i.src;
    });
  }

  function resetTransform() {
    scale = 1;
    posX = 0;
    posY = 0;
    img.style.transform = `translate(0,0) scale(1)`;
  }

  // Zoom con scroll
  img.addEventListener("wheel", e => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 3);
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  });

  // Drag cuando está en zoom
  img.addEventListener("mousedown", e => {
    if (scale <= 1) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    img.parentElement.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    img.parentElement.style.cursor = "grab";
  });

  // Swipe móvil
  let touchStartX = 0;

  img.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  });

  img.addEventListener("touchend", e => {
    let diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  });

  // Eventos
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

});