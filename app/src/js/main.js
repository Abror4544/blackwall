var swiper = new Swiper(".companySwiper", {
  spaceBetween: 30,
  breakpoints: {
    0: {
      slidesPerView: 4,
      slidesPerGroup: 1,
    },
    767: {
      slidesPerView: 6,
      slidesPerGroup: 6,
    }
  },
});

let bar = document.querySelector(".menu-open");
let close = document.querySelector(".menu-close");
let menu = document.querySelector(".menu");

let menuToggle = (btn, target) => {
  btn.addEventListener("click", () => {
    target.classList.toggle("active");
  });
};
menuToggle(bar, menu);
menuToggle(close, menu);
