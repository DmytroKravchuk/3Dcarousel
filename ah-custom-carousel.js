/*-------util functions----------*/

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

	this.props = {
		container: this.carousel.getElementsByClassName('carousel-container')[0],
		items: htmlCollectionToArray(this.carousel.querySelectorAll(options.items)),
		buttons: htmlCollectionToArray(this.carousel.querySelectorAll(options.button)),
		navigation: options.navigation,
		context: options.context || {
			contextX: 1,
			contextY: 1
		},
		currentIndexSlide: options.firstSlide || 0,
		scale: options.scale || 1,
		angle: 0,
		step: options.step || 1,
		autoplay: options.autoplay,
		fullCircle: 360
	};

	if(!this.props.container){
		throw new Error('Incorrect container class');
	}

	this.events = {
		'touch': [
			{
				'target': this.props.container,
				'event': 'swipeleft',
				'handler': this._swipeLeft.bind(this)
			},
			{
				'target': this.props.container,
				'event': 'swiperight',
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

	this.init();
}

/*--------------Init-----------------*/

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
	var positionItem = {};
	positionItem.posY = ((1 + Math.sin(degToRad(itemDeg))) * ((this._rangeX / 2) * this.props.context.contextX)) + (this._rangeX / 2) * (1 - this.props.context.contextX);
	positionItem.posX = ((1 + Math.cos(degToRad(itemDeg))) * ((this._rangeY / 2) * this.props.context.contextY)) + (this._rangeY / 2) * (1 - this.props.context.contextY);
	return positionItem;
};

Carousel.prototype.animate = function (elem, index, angle) {
	var itemDeg = this._itemDeg(angle, index);
	var positionItem = this._itemPosition(itemDeg);

	var ITEMCOS = 0.5 + (Math.cos(degToRad(itemDeg)) * 0.5);

	var zIndex = 1 + Math.round(ITEMCOS * 100);
	var itemScale = 1 - (1 - this.props.scale) + (ITEMCOS * (1 - this.props.scale));
	var itemOpacity = 1 - (1 - this.props.opacity) + (ITEMCOS * (1 - this.props.opacity));

	elem.style.left = pxToPercent(this.containerW, positionItem.posY);
	elem.style.top = pxToPercent(this.containerH, positionItem.posX);
	elem.style.zIndex = zIndex;
	elem.style['moztransform'] = 'scale(' + itemScale + ')';
	elem.style.transform = 'scale(' + itemScale + ')';
	elem.style.opacity = itemOpacity;
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
	var index = this.currentIndexSlide();
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
	if (this.props.buttons) {
		this._activeElem(this.props.buttons);
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
	if(this.props.buttons.length !== 0){
		var index = this.props.buttons.indexOf(e.target);

		if(e.target === this.props.buttons[index]){
			this._setActivePagination(index, this.props.buttons);
		}
	}
};

/*----------- navigation-----------*/
Carousel.prototype._navigationEvent = function(event){
	if(this.props.navigation) {
		var prevEl = document.querySelector(this.props.navigation.prevEl);
		var nextEl = document.querySelector(this.props.navigation.nextEl);
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
	this.nextSlide();
};

Carousel.prototype._swipeRight = function(e){
	e.preventDefault();
	this.prevSlide();
};

Carousel.prototype.swipe = function () {
	this._touchMove = false;
	this.events.touch.forEach(function(item) {
		if(item.target === this.props.container){
			item.target.addEventListener(item.event, item.handler);
		}
	}.bind(this));
};

/*------goToSlide-----*/
Carousel.prototype._goToSlide = function (isForward) {
	var multiplier = isForward ? -1 : 1;
	var index = this._validate(multiplier * this.props.step);
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
	for(element in this.events){
		htmlCollectionToArray(this.events[element]).forEach(function (item) {
			item.target.removeEventListener(item.event, item.handler);
		});
	}
};
