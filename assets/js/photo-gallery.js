document.querySelectorAll(".photo-gallery").forEach((gallery) => {
  const viewer = gallery.querySelector(".photo-viewer");
  if (!viewer || typeof viewer.showModal !== "function") return;

  const photos = [...gallery.querySelectorAll(".photo-gallery-item > a")];
  const stage = viewer.querySelector(".photo-viewer-stage");
  const enlargedPhoto = new Image();
  stage.append(enlargedPhoto);
  const position = viewer.querySelector(".photo-viewer-position");
  const previous = viewer.querySelector(".photo-viewer-previous");
  const next = viewer.querySelector(".photo-viewer-next");
  let currentIndex = 0;
  let opener;
  let swipeStart;

  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    enlargedPhoto.alt = photo.querySelector("img").alt;
    enlargedPhoto.src = photo.href;
    position.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  photos.forEach((photo, index) => {
    photo.setAttribute("aria-haspopup", "dialog");
    photo.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = photo;
      showPhoto(index);
      viewer.showModal();
    });
  });

  previous.hidden = next.hidden = photos.length < 2;
  previous.addEventListener("click", () => showPhoto(currentIndex - 1));
  next.addEventListener("click", () => showPhoto(currentIndex + 1));
  viewer.querySelector(".photo-viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer || event.target === stage || event.target === enlargedPhoto) viewer.close();
  });
  viewer.addEventListener("close", () => {
    swipeStart = undefined;
    opener.focus({ preventScroll: true });
  });
  viewer.addEventListener("keydown", (event) => {
    if (photos.length < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    showPhoto(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
  });

  if (photos.length < 2) return;

  stage.addEventListener("touchstart", (event) => {
    swipeStart = event.touches.length === 1 ? event.touches[0] : undefined;
  }, { passive: true });
  stage.addEventListener("touchcancel", () => {
    swipeStart = undefined;
  });
  stage.addEventListener("touchend", (event) => {
    const start = swipeStart;
    swipeStart = undefined;
    if (!start) return;

    const end = event.changedTouches[0];
    const horizontal = end.clientX - start.clientX;
    const vertical = end.clientY - start.clientY;
    if (Math.abs(horizontal) < 45 || Math.abs(horizontal) <= Math.abs(vertical)) return;

    event.preventDefault();
    showPhoto(currentIndex + (horizontal < 0 ? 1 : -1));
  }, { passive: false });
});
