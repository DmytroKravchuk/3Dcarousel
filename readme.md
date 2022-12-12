![preview](https://github.com/DmytroKravchuk/3Dcarousel/blob/master/assets/preview.gif?raw=true)

# Carousel full html layout
    <div id="carousel" class="">
    	<div class="carousel-container">
    		<div class="carousel-item">Slide 1</div>
    		<div class="carousel-item">Slide 2</div>
    		<div class="carousel-item">Slide 3</div> 
            ...
    	</div>
    	#Buttons
    	<div class="">
        	<button class="btn-item">btn 1</button>
        	<button class="btn-item">btn 2</button>
        	<button class="btn-item">btn 3</button>
            ...
       	</div>

    	#Add Arrows
    	<div class="carousel-btn-prev"></div>
    	<div class="carousel-btn-next"></div>
    </div>

#----Carousel initialize-----------#
    var carousel = new Carousel('#carousel',{
        items:'.carousel-item'
    });

# Carousel parameters------------#
#----------
items - Required parameter for searching for slides
    {...
       items:'your class'
    ...}
#----------
button - Parameter allows you to specify your own buttons to navigate through the slides. (It's useful if you want to use your content in buttons)
    {...
        button:'your class'
    ..}
#---------
firstSlide -  Parameter allows you to set the number of the initial slide (default 0)
    {..
        firstSlide: 3
    ..}
#--------
navigation - Object with navigation parameters.
    {..
        navigation: {
            nextEl: 'your class',
            prevEl: 'your class',
          }
     ..}
#------------
autoplay - Delay between transitions (in ms). If this parameter is not specified, auto play will be disabled
    {..
        autoplay: 2000
    ..}
#---------
step - Number of slides per scrolling
    {..
        step: 3
    ..}
#----------    
context - Object with settings for perspective (from -1 to 1)
    {..
        context:{
            contextX: 1,
            contextY: 1,
          }
    ..}
#---------

scale - will set  minimum value for scale (default 1)

#---------
opacity - will set  minimum value for opacity (default 1)

#----------METHODS-------------------
init() - initialize carousel
destroy() - destroy carousel
autoplay(value) - initialize autoplay
stopAutoplay() - stop autoplay for carousel
getActiveItem() - get active slide
#--------Example
    carousel = new Carousel('#carousel',{
      items:'.carousel-item',
      button:'.btn-item',
      step: 1,
      firstSlide:0,
      scale: 0.5,
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
