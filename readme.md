![preview](https://github.com/DmytroKravchuk/3Dcarousel/blob/master/assets/preview.gif?raw=true)

# 3D Carousel (Vanilla JS)

    import "3d-carousel-vanilla"

    <div id="carousel">
    	<div class="carousel-container">
    		<div class="carousel-item">Slide 1</div>
    		<div class="carousel-item">Slide 2</div>
    		<div class="carousel-item">Slide 3</div> 
    		<div class="carousel-item">Slide 4</div> 
    		<div class="carousel-item">Slide 5</div> 
    	</div>
    </div>

# Example
    const carousel = new Carousel('#carousel',{
      container: '.carousel-container',
      items:'.carousel-item',
      step: 1,
      firstSlide: 0,
      scale: 0.5,
      opacity: 1,
      autoplay: 3000,
      transition: 0.3,
      context:{
        contextX: 1,
        contextY: 0.6,
      },
    });

# Carousel initialize
    const carousel = new Carousel('#carousel',{
        container: '.carousel-container'
        items:'.carousel-item',
    });

# Carousel parameters
container - slided wrapper

`container: 'your class name'`

items - Required parameter for searching slides

 `items:'your class'`

#
`firstSlide -  Parameter allows you to set the number of the initial slide (default 0)`

#
autoplay - Delay between transitions (in ms). If this parameter is not specified, auto play will be disabled
    `autoplay: 3000`
    
#
step - Number of slides per scrolling

  `step: 1`

#
`transition - time between two states of an element (default: 0.3) in sec.`
#    
context - Props for perspective (from -1 to 1)

`context: {
   contextX: 1,
   contextY: 0.6,
 }`

`scale - minimum value for scale (default 1)`

`opacity - minimum value for opacity (default 1)`

`resetDefaultStyles - reser all default styles (default: false)`
# METHODS
`init() - initialize carousel`

`destroy() - destroy carousel`

`autoplay(value) - initialize autoplay`

`stopAutoplay() - stop autoplay`

`getActiveItem() - get active slide`
