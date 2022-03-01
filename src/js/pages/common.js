import { gsap } from "gsap"

const commonInit = () => {
  console.log("common!");
  gsap.to("header", {});
}

document.addEventListener("DOMContentLoaded", function () {
  commonInit();
});