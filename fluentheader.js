
var fluentHeader = function(option) {
  this.rExtend = function(to, from) {
    for (var n in from) {
      if (typeof to[n] != 'object') {
        to[n] = from[n];
      } else if (typeof to[n] == 'object') {
        to[n] = rExtend(to[n], from[n]);
      }
    }

    return to;
  }

  this.defConfig = {
    header: 'header',
		wrap: 'header_wrap',
		elements: []
  };

  this.option = this.rExtend(this.defConfig, option);

  this.headerH = 0;
  this.elementsH = [];

  this.getHeader = function() {
    return document.getElementById(this.option.header);
  }

  this.getHeaderH = function() {
  	if (this.headerH == 0)
    	this.headerH = this.getHeader().offsetHeight;

  	return this.headerH;
  }

  this.getWrap = function() {
    return document.getElementById(this.option.wrap);
  }

  this.setHeader = function() {
  	var header = this.getHeader();

  	header.style.position = 'fixed';
  	header.style.width = '100%';
  }

  this.setWrapH = function() {
    var wrap = this.getWrap();

    wrap.style.height = this.getHeaderH() + 'px';
  }

  this.setElementsH = function() {
  	var els = this.option.elements;

    for (var i = 0; i < els.length; i++) {
  		var elE = document.getElementById(els[i].el);

  		this.elementsH.push(elE.offsetHeight);
  	}
  }

  this.setStyle = function(el, topP, hsP, trueCall, falseCall) {
  	if (topP > hsP)
  		trueCall(el, topP);
  	else
  		falseCall(el, hsP);
  }

  this.headerMove = function(top) {
  	var delta = top;
  	var elements = this.option.elements;
  	var hs = this.elementsH;
  	var elE = [];

  	for (var i = 0; i < elements.length; i++) {
			elE.push( document.getElementById(elements[i].el) );

			var topP = hs[i] - delta;
  		var hsP = hs[i] / 3;

  		if (elements[i].type == 'hidden')
	  		hsP = hs[i] / 4;

	  	switch(elements[i].type) {
	  		case 'all':
	  			this.setStyle(elE[i], topP, hsP,
  					function(el, topP) {
  						el.style.width = topP + 'px';
	  					el.style.height = topP + 'px';
  					},
  					function(el, hsP) {
  						el.style.width = hsP + 'px';
	  					el.style.height = hsP + 'px';
  					}
  				);
		  	break;

		  	case 'w':
		  		this.setStyle(elE[i], topP, hsP,
  					function(el, topP) {
  						el.style.width = topP + 'px';
  					},
  					function(el, hsP) {
  						el.style.width = hsP + 'px';
  					}
  				);
		  	break;

		  	case 'h':
		  		this.setStyle(elE[i], topP, hsP,
  					function(el, topP) {
	  					el.style.height = topP + 'px';
  					},
  					function(el, hsP) {
	  					el.style.height = hsP + 'px';
  					}
  				);
		  	break;

		  	case 'hidden':
		  		this.setStyle(elE[i], topP, hsP,
  					function(el, topP) {
  						el.style.display = '';
  					},
  					function(el, hsP) {
  						el.style.display = 'none';
  					}
  				);
		  	break;

		  	case 'all_hidden':
		  		this.setStyle(elE[i], topP, hsP,
  					function(el, topP) {
  						el.style.display = '';
  						el.style.width = topP + 'px';
	  					el.style.height = topP + 'px';
  					},
  					function(el, hsP) {
  						el.style.display = 'none';
  					}
  				);
		  	break;
	  	}
  	}
  }

  this.scrollRun = function(type) {
    var self = this;
    var lastScrollTop = 0;

    var eScroll = function(ev) {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;

      if (scrolled > lastScrollTop)
        self.headerMove(scrolled);
      else
        self.headerMove(scrolled);

      lastScrollTop = scrolled;
    };

    if (type == 'start')
      document.addEventListener('scroll', eScroll, false);
    else
      document.removeEventListener('scroll', eScroll, false);
  }

  this.startApp = function(isResize) {
  	this.headerH = 0;

  	this.setHeader();
  	this.setWrapH();
  	this.setElementsH();

  	if (isResize)
  		this.scrollRun('stop');

  	this.scrollRun('start');

  	if (!isResize)
		  this.rasizeEv();
  }

  this.rasizeEv = function() {
    var self = this;
    var resetApp = function() {
    	self.startApp(true);
    }

    window.addEventListener('resize', function() {
    	window.scrollTo(0, 0);

    	setTimeout(resetApp, 100);
    });
  };

  this.init = function() {
  	this.startApp(false);
  }

  this.init();
};