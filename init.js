import {Carousel} from "./ah-custom-carousel.js";

const carousel = new Carousel('#carousel',{
    items:'.carousel-item',
    button:'.btn-item',
    step: 1,
    firstSlide:0,
    scale: 0.4,
    opacity: 0.5,
    autoplay: 3000,
    context:{
    contextX: 1,
    contextY: 0.6,
},
    navigation: {
    nextEl: '.carousel-btn-next',
    prevEl: '.carousel-btn-prev'
}
});
