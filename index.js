import "swipe-dk"

/*-------utils----------*/

function degToRad (value) {
	return value * (Math.PI / 180);
}

function pxToPercent(mainSize, value) {
	return value / mainSize * 100 + '%';
}

function getRectMeasure(el, measure) {
	return el.getBoundingClientRect()[measure];
}

function htmlCollectionToArray(collections) {
	return Array.prototype.slice.call(collections);
}

/*-------------------------------*/

function Carousel(element, options) {
	this.carousel = document.querySelector(element);
	const carouselItems = htmlCollectionToArray(this.carousel.querySelectorAll(options.items));

	const {controlsContainer, navigation} = this._createControlElements(carouselItems)

	this.props = {
		container: this.carousel.querySelector(options.container),
		items: carouselItems,
		dotsContainer: controlsContainer,
		dots: htmlCollectionToArray(controlsContainer.childNodes),
		navigation: navigation,
		context: options.context || {
			contextX: 1,
			contextY: 0.6
		},
		currentIndexSlide: options.firstSlide || 0,
		scale: options.scale || 1,
		angle: 0,
		step: options.step || 1,
		autoplay: options.autoplay,
		transition: options.transition || 0.3,
		fullCircle: 360,
		resetDefaultStyles: options.resetDefaultStyles || false,
	};

	if(!this.props.container){
		throw new Error('Incorrect container class');
	}

	this.events = {
		'touch': [
			{
				'target': this.props.container,
				'event': 'swipe-left',
				'handler': this._swipeLeft.bind(this)
			},
			{
				'target': this.props.container,
				'event': 'swipe-right',
				'handler': this._swipeRight.bind(this)
			}
		],
		'tapPagination': [
			{
				'target': this.carousel,
				'event': 'click',
				'handler': this._eventPagination.bind(this)
			}
		],
		'tapNavigation': [
			{
				'target': this.carousel,
				'event': 'click',
				'handler': this._navigationEvent.bind(this)
			}
		]
	};

	if (!this.props.resetDefaultStyles) {
		this._setDefaultStyles()
	}

	this.init();
}

/*--------------Init-----------------*/

Carousel.prototype._createControlElements = function (carouselItems) {
	const controlsContainer = document.createElement('div');
	controlsContainer.classList.add('carousel-controls-wrapper');
	carouselItems.forEach(() => {
		const dot = document.createElement('button');
		dot.classList.add('carousel-control-item')
		controlsContainer.append(dot)
	})
	this.carousel.append(controlsContainer);

	const navPrev = document.createElement('button');
	navPrev.classList.add('carousel-nav-prev');
	const navNext = document.createElement('button');
	navNext.classList.add('carousel-nav-prev');

	this.carousel.append(navPrev);
	this.carousel.append(navNext);

	return {
		controlsContainer,
		navigation: {
			prevEl: navPrev,
			nextEl: navNext,
		}
	}
}

Carousel.prototype._setDefaultStyles = function () {
	this.carousel.style.position = 'relative';
	this.props.container.style.cssText = `position: relative;width: 100%;height: 300px; margin: 0 auto;`;
	this.props.items.forEach(function (item) {item.style.cssText = `position: absolute; left: 50%; top: 50%; width: 200px; height: 100px; display: flex; align-items: center; justify-content: center;
	background: #ccc;`})
	this.props.dots.forEach(item => item.style.cssText = `width: 5px; height: 5px`);
	this.props.navigation.prevEl.style.cssText = `position: absolute; top: 50%; transform: translateY(-50%); left: 20px; width: 15px; height: 20px; background: #fefefe;`;
	this.props.navigation.nextEl.style.cssText = `position: absolute; top: 50%; transform: translateY(-50%); right: 20px; width: 15px; height: 20px; background: #fefefe;`;
}

Carousel.prototype.setAngle = function () {
	this.props.angle = this.props.fullCircle - (this.currentIndexSlide() * this._itemDegreeSeparation);
};

Carousel.prototype.init = function () {
	this.calcProps();
	this.engine(this.currentIndexSlide());
	this.navigationTo([this.events.tapNavigation, this.events.tapPagination]);
	this.swipe();
	this.autoplay(this.props.autoplay);
};

Carousel.prototype.calcProps = function(){
	this.countItems = this.props.items.length;
	this._itemDegreeSeparation = this.props.fullCircle / this.countItems;
	this.containerW = getRectMeasure(this.props.container,'width');
	this.containerH = getRectMeasure(this.props.container,'height');
	this.itemW = getRectMeasure(this.props.items[0],'width');
	this.itemH = getRectMeasure(this.props.items[0],'height');
	this._rangeX = this.containerW - this.itemW;
	this._rangeY = this.containerH - this.itemH;
};
/*-------Animation slide---------*/

Carousel.prototype._itemDeg = function(angle, index){
	angle = angle || this.props.angle;
	return angle + this._itemDegreeSeparation * index;
};

Carousel.prototype._itemPosition = function(itemDeg){
	const positionItem = {};
	positionItem.posY = ((1 + Math.sin(degToRad(itemDeg))) * ((this._rangeX / 2) * this.props.context.contextX)) + (this._rangeX / 2) * (1 - this.props.context.contextX);
	positionItem.posX = ((1 + Math.cos(degToRad(itemDeg))) * ((this._rangeY / 2) * this.props.context.contextY)) + (this._rangeY / 2) * (1 - this.props.context.contextY);
	return positionItem;
};

Carousel.prototype.animate = function (elem, index, angle) {
	const itemDeg = this._itemDeg(angle, index);
	const positionItem = this._itemPosition(itemDeg);

	const ITEMCOS = 0.5 + (Math.cos(degToRad(itemDeg)) * 0.5);

	const zIndex = 1 + Math.round(ITEMCOS * 100);
	const itemScale = 1 - (1 - this.props.scale) + (ITEMCOS * (1 - this.props.scale));
	const itemOpacity = 1 - (1 - this.props.opacity) + (ITEMCOS * (1 - this.props.opacity));

	elem.style.left = pxToPercent(this.containerW, positionItem.posY);
	elem.style.top = pxToPercent(this.containerH, positionItem.posX);
	elem.style.zIndex = zIndex;
	elem.style['moztransform'] = `scale(${itemScale})`;
	elem.style.transform = `scale(${itemScale})`;
	elem.style.opacity = itemOpacity;
	elem.style.transition = `${this.props.transition}s`;
};

/*-----Set active item------*/

Carousel.prototype._activeElem = function(arrayElem){
	arrayElem.forEach(function (el, i) {
		el.classList.remove('active');
		if (this.currentIndexSlide() === i) {
			el.classList.add('active');
		}
	}.bind(this));
};

Carousel.prototype.engine = function(index) {
	this.setCurrentIndexSlide(index);
	this.setAngle();
	this.setItemPosition(this.props.items, this.props.angle);
	this.setActiveItem();
};

Carousel.prototype.setCurrentIndexSlide = function(value) {
	this.props.currentIndexSlide = value;
};

Carousel.prototype.currentIndexSlide = function() {
	return this.props.currentIndexSlide;
};
Carousel.prototype._validate = function(step){
	let index = this.currentIndexSlide();
	index += step;
	if (index >= this.countItems) {
		index -= this.countItems;
	} else if (index < 0) {
		index += this.countItems;
	}
	return index;
};

Carousel.prototype.setActiveItem = function () {
	this._activeElem(this.props.items);
	if (this.props.dots) {
		this._activeElem(this.props.dots);
	}
};

Carousel.prototype.getActiveItem = function () {
	return this.props.items[this.currentIndexSlide()];
};
/*------Carousel items position---------*/

Carousel.prototype.setItemPosition = function (itemList, angle) {

	itemList.forEach(function (element, index) {
		this.animate(element, index, angle);
	}.bind(this));
};

/*----------------Pagination----------------------*/
Carousel.prototype._setActivePagination = function(index){
	this.engine(index);
};

Carousel.prototype._eventPagination = function(e){
	if(this.props.dots.length !== 0){
		const index = this.props.dots.indexOf(e.target);

		if(e.target === this.props.dots[index]){
			this._setActivePagination(index, this.props.dots);
		}
	}
};

/*----------- navigation-----------*/
Carousel.prototype._navigationEvent = function(event){
	if(this.props.navigation) {
		const {prevEl, nextEl} = this.props.navigation;
		if (event.target === prevEl) {
			this.prevSlide();
		} else if (event.target === nextEl) {
			this.nextSlide();
		}
	}
};

Carousel.prototype.navigationTo = function (targets) {
	targets.forEach(function (element) {
		element.forEach(function(item) {
			item.target.addEventListener(item.event, item.handler);
		});
	});
};

/*----------Carousel swipe------------*/

Carousel.prototype._swipeLeft = function startHandler(e) {
	e.preventDefault();
	this.prevSlide();
};

Carousel.prototype._swipeRight = function(e){
	e.preventDefault();
	this.nextSlide();
};

Carousel.prototype.swipe = function () {
	this.events.touch.forEach(function(item) {
		if(item.target === this.props.container){
			item.target.addEventListener(item.event, item.handler);
		}
	}.bind(this));
};

/*------goToSlide-----*/
Carousel.prototype._goToSlide = function (isForward) {
	const multiplier = isForward ? -1 : 1;
	const index = this._validate(multiplier * this.props.step);
	this.engine(index);
};

Carousel.prototype.prevSlide = function () {
	this._goToSlide(true);
};

Carousel.prototype.nextSlide = function () {
	this._goToSlide(false);
};

/*---------Carousel autoplay-------------*/
Carousel.prototype.autoplay = function (autoplay) {
	if (autoplay) {
		this.startAutoplay = setInterval(function () {
			this.nextSlide();
		}.bind(this), autoplay);
	}
};

Carousel.prototype.stopAutoplay = function(){
	clearInterval(this.startAutoplay);
};

/*------destroy-------*/
Carousel.prototype.destroy = function () {
	for(const element in this.events){
		htmlCollectionToArray(this.events[element]).forEach(function (item) {
			item.target.removeEventListener(item.event, item.handler);
		});
	}
};

export {Carousel}
