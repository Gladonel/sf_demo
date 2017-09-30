/** ********************************************** **
	@Author			Dorin Grigoras
	@Website		www.stepofweb.com
	@Last Update	Friday, August 21, 2015

	NOTE! 	Do not change anything here if you want to
			be able to update in the future! Please use
			your custom script (eg. custom.js).

	TABLE CONTENTS
	-------------------------------


*************************************************** **/
	window.width = jQuery(window).width();

	jQuery(window).ready(function() {

		// Load Bootstrap JS
		loadScript(plugin_path + 'bootstrap/js/bootstrap.min.js', function() {

			FirstInit();

		});

	});


	/* First Page Load - Ajax or Non Ajax */
	function FirstInit() {

		/*
			add browser type to 'html'
		*/	jQuery.browserDetect();

		/*
			fullscreen switcher
		*/	_goFullScreen();

		/*
			aside init
		*/	_aside();

		/*
			The first load will always be false because it's not ajax!
			The second load will be called by each page via Init(true);
		*/	Init(false);

	}


	/*!
		This function is called on each page refresh,
		including on ajax each page load.

		Add to your ajax index page:
		<script>window.ajax = true;</script>
	!*/
	function Init(ajax) {
		_owl_carousel();
		_popover();
		_lightbox();
		_scrollTo();
		_toggle();
		_placeholder();
		_charts(ajax);
		_slimScroll();
		_autosuggest();
		_form();
		_select2();
		_stepper();
		_pickers();
		_editors();
		_misc();
		_afterResize(ajax);
		_panels();
		_modalAutoLoad();
		_toastr(false,false,false,false);
		_confirmRemoval();
		_countDown();
		_initDate();

		/** ajax page **/
		_ajaxPage(ajax);

		/** Bootstrap Tooltip **/
		jQuery("[data-toggle=tooltip]").tooltip();

        /** Hold dropdown on click  **/
        jQuery('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
            e.stopPropagation();
        });
	}




/** After Resize
 **************************************************************** **/
	function _afterResize(ajax) {

		/*
			IMPORTAT!
			We need .load() otherwise will cause conflicts
			Conflict example: flot.resize.js
		*/
		jQuery(window).load(function() {
			"use strict";

			// On Resize
			jQuery(window).resize(function() {

				if(window.afterResizeApp) {
					clearTimeout(window.afterResizeApp);
				}

				window.afterResizeApp = setTimeout(function() {

					/**
						After Resize Code
						.................
					**/
					window.width = jQuery(window).width();

					// Mobile & desktop menu
					if(window.width > 768) {
						jQuery("#mobileMenuBtn").removeClass('active');
					} else {
						jQuery("#mobileMenuBtn").removeClass('active');
						jQuery('body').removeClass('menu-open');
					}

					// Aside
					_asideFix();

				}, 300);

			});


		});

	}



/** ScrollTo
 **************************************************************** **/
	function _scrollTo() {

		jQuery("a.scrollTo").bind("click", function(e) {
			e.preventDefault();

			var href = jQuery(this).attr('href');

			if(href != '#') {
				jQuery('html,body').animate({scrollTop: jQuery(href).offset().top}, 800, 'easeInOutExpo');
			}
		});

		jQuery("a#toTop").bind("click", function(e) {
			e.preventDefault();
			jQuery('html,body').animate({scrollTop: 0}, 800, 'easeInOutExpo');
		});
	}



/** Load Script

	USAGE
	var pageInit = function() {}
	loadScript("script.js", pageInit);

	Load multiple scripts and call a final function
	loadScript("script1.js", function(){
		loadScript("script2.js", function(){
			loadScript("script3.js", function(){
				loadScript("script4.js", pageInit);
			});
		});
	});
 **************************************************************** **/
	var _arr 	= {};
	function loadScript(scriptName, callback) {

		if (!_arr[scriptName]) {
			_arr[scriptName] = true;

			var body 		= document.getElementsByTagName('body')[0];
			var script 		= document.createElement('script');
			script.type 	= 'text/javascript';
			script.src 		= scriptName;

			// then bind the event to the callback function
			// there are several events for cross browser compatibility
			// script.onreadystatechange = callback;
			script.onload = callback;

			// fire the loading
			body.appendChild(script);

		} else if (callback) {

			callback();

		}

	};


/** Ajax Click
 **************************************************************** **/
	function _ajaxLink(ajax) {

		if(ajax === true) {
			jQuery("a").bind("click", function(e) {
				if(!jQuery(this).hasClass('external') &&
					jQuery(this).attr('href') != '#' &&
					jQuery(this).attr('href') != 'javascript:;' &&
					jQuery(this).attr('href') != 'javascript:void(0);' &&
					jQuery(this).attr('href') != 'javascript:void(0)'
				) {
					e.preventDefault();

					var _href = jQuery(this).attr('href'),
						_href = _href.replace('#', '');

					window.location.hash 	= jQuery(this).attr('href');
				} else {
					e.preventDefault();
					e.stopPropagation();
				}
			});
		}

	}



/** Ajax Page
 **************************************************************** **/
	function _ajaxPage(ajax) {

		if(!window.ajax) {
			return false;
		}

		// Link Click
		jQuery(document).on('click', '.ajaxNav a[href!="#"], a.ajax[href!="#"]', function(e) {
			e.preventDefault();

			window.location.hash 	= jQuery(this).attr('href');
			document.title 			= jQuery(this).attr('title') || jQuery(this).html().replace(/(<([^>]+)>)/ig,""); // get link title or parse content.

		});


		// On First Load, if window.ajax === true
		if(window.ajax === true && ajax === false) {

			// Hash Change Monitor
			jQuery(window).on('hashchange', function() {
				_loadPage(window.location.hash, '#middle');
			});


			// On Load - from url
			_loadPage(window.location.hash, '#middle');

		}

	}




 /** Load Page
 **************************************************************** **/
	function _loadPage(_hash, container) {
		if(_hash == '#') {
			return false;
		}

		if(!container) {
			var container = '#middle';
		}

		_hash = _hash.replace('#', '');

		if(_hash == '') {
			window.location.hash = '#dashboard.html';
			_hash = 'dashboard.html';
		}

		// REMOVE ON PRODUCTION: 'tpl/'
		_hash = 'tpl/' + _hash;

		jQuery.ajax({
			url 		: _hash,
			dataType 	: 'html',
			type 		: 'GET',
			cache 		: true, // warning: this will cause a timestamp and will call the request twice
			async 		: false,

			beforeSend 	: function() {
				jQuery('#middle').html('<h1 class="ajax-loading"><i class="fa fa-cog fa-spin"></i> loading</h1>');
			},

			success : function(data) {

				// Append only, not visible
				jQuery(container).css({'opacity':'0.0'}).html(data).delay(50).animate({'opacity':'0.0'}, 0, function() {

					// Init Ajax - required, to avoid loadScript error from external call
					ajaxInit();

					jQuery(container).animate({'opacity':'1.0'}, 300);


				});

			},

			complete: function(){
				Init(true); // Reinit
			},

			// 404 ERROR MESSAGE
			error : function(xhr, ajaxOptions, thrownError) {
				jQuery(container).html('<div class="text-center ajax-err"><h1 class="err404"><i class="fa fa-warning"></i>Page not found<small></small></h1></div>');
			}
		});
	}


/** Slimscroll
 **************************************************************** **/
	function _slimScroll() {

		jQuery('.slimscroll').each(function () {

			var height;
			if (jQuery(this).attr("data-height")) {
				height = jQuery(this).attr("data-height");
			} else {
				height = jQuery(this).height();
			}

			jQuery(this).slimScroll({
				size: 				jQuery(this).attr("data-size") 							|| '7px',
				opacity: 			jQuery(this).attr("data-opacity") 						|| .6,
				position: 			jQuery(this).attr("data-position") 						|| 'right',
				allowPageScroll:	false, // not working
				disableFadeOut: 	false,
				railVisible: 		true,
				railColor: 			jQuery(this).attr("data-railColor")						|| '#222',
				railOpacity: 		jQuery(this).attr("data-railOpacity") 					|| 0.05,
				alwaysVisible: 		(jQuery(this).attr("data-alwaysVisible") != "false" 	? true : false),
				railVisible: 		(jQuery(this).attr("data-railVisible")   != "false" 	? true : false),
				color: 				jQuery(this).attr("data-color")  						|| '#333',
				wrapperClass: 		jQuery(this).attr("data-wrapper-class") 				|| 'slimScrollDiv',
				railColor: 			jQuery(this).attr("data-railColor")  					|| '#eaeaea',
				height: 			height
			});


			// Disable body scroll on slimscroll hover
			if(jQuery(this).attr('disable-body-scroll') == 'true') {

				jQuery(this).bind('mousewheel DOMMouseScroll', function(e) {
					var scrollTo = null;

					if (e.type == 'mousewheel') {
						scrollTo = (e.originalEvent.wheelDelta * -1);
					}
					else if (e.type == 'DOMMouseScroll') {
						scrollTo = 40 * e.originalEvent.detail;
					}

					if (scrollTo) {
						e.preventDefault();
						jQuery(this).scrollTop(scrollTo + jQuery(this).scrollTop());
					}
				});

			}

		});

	}


/** OWL Carousel
 **************************************************************** **/
	function _owl_carousel() {
		var total = jQuery("div.owl-carousel").length,
			count = 0;

		if (total > 0) {
			loadScript(plugin_path + 'owl-carousel/owl.carousel.min.js', function() {

				jQuery("div.owl-carousel").each(function() {

					var slider 		= jQuery(this);
					var options 	= slider.attr('data-plugin-options');

					// Progress Bar
					var $opt = eval('(' + options + ')');  // convert text to json

					if($opt.progressBar == 'true') {
						var afterInit = progressBar;
					} else {
						var afterInit = false;
					}

					var defaults = {
						items: 					5,
						itemsCustom: 			false,
						itemsDesktop: 			[1199,4],
						itemsDesktopSmall: 		[980,3],
						itemsTablet: 			[768,2],
						itemsTabletSmall: 		false,
						itemsMobile: 			[479,1],
						singleItem: 			true,
						itemsScaleUp: 			false,

						slideSpeed: 			200,
						paginationSpeed: 		800,
						rewindSpeed: 			1000,

						autoPlay: 				false,
						stopOnHover: 			false,

						navigation: 			false,
						navigationText: [
											'<i class="fa fa-chevron-left"></i>',
											'<i class="fa fa-chevron-right"></i>'
										],
						rewindNav: 				true,
						scrollPerPage: 			false,

						pagination: 			true,
						paginationNumbers: 		false,

						responsive: 			true,
						responsiveRefreshRate: 	200,
						responsiveBaseWidth: 	window,

						baseClass: 				"owl-carousel",
						theme: 					"owl-theme",

						lazyLoad: 				false,
						lazyFollow: 			true,
						lazyEffect: 			"fade",

						autoHeight: 			false,

						jsonPath: 				false,
						jsonSuccess: 			false,

						dragBeforeAnimFinish: 	true,
						mouseDrag: 				true,
						touchDrag: 				true,

						transitionStyle: 		false,

						addClassActive: 		false,

						beforeUpdate: 			false,
						afterUpdate: 			false,
						beforeInit: 			false,
						afterInit: 				afterInit,
						beforeMove: 			false,
						afterMove: 				(afterInit == false) ? false : moved,
						afterAction: 			false,
						startDragging: 			false,
						afterLazyLoad: 			false
					}

					var config = jQuery.extend({}, defaults, options, slider.data("plugin-options"));
					slider.owlCarousel(config).addClass("owl-carousel-init");


					// Progress Bar
					var elem = jQuery(this);

					//Init progressBar where elem is $("#owl-demo")
					function progressBar(elem){
					  $elem = elem;
					  //build progress bar elements
					  buildProgressBar();
					  //start counting
					  start();
					}

					//create div#progressBar and div#bar then prepend to $("#owl-demo")
					function buildProgressBar(){
					  $progressBar = $("<div>",{
						id:"progressBar"
					  });
					  $bar = $("<div>",{
						id:"bar"
					  });
					  $progressBar.append($bar).prependTo($elem);
					}

					function start() {
					  //reset timer
					  percentTime = 0;
					  isPause = false;
					  //run interval every 0.01 second
					  tick = setInterval(interval, 10);
					};


					var time = 7; // time in seconds
					function interval() {
					  if(isPause === false){
						percentTime += 1 / time;
						$bar.css({
						   width: percentTime+"%"
						 });
						//if percentTime is equal or greater than 100
						if(percentTime >= 100){
						  //slide to next item
						  $elem.trigger('owl.next')
						}
					  }
					}

					//pause while dragging
					function pauseOnDragging(){
					  isPause = true;
					}

					//moved callback
					function moved(){
					  //clear interval
					  clearTimeout(tick);
					  //start again
					  start();
					}

				});


			});
		}

	}



/** Popover
 **************************************************************** **/
	function _popover() {

			jQuery("a[data-toggle=popover]").bind("click", function(e) {
				jQuery('.popover-title .close').remove();
				e.preventDefault();
			});

			var isVisible 	= false,
				clickedAway = false;


			jQuery("a[data-toggle=popover], button[data-toggle=popover]").popover({

					html: true,
					trigger: 'manual'

				}).click(function(e) {

					jQuery(this).popover('show');

					clickedAway = false;
					isVisible = true;
					e.preventDefault();

				});

				jQuery(document).click(function(e) {
					if(isVisible & clickedAway) {

						jQuery("a[data-toggle=popover], button[data-toggle=popover]").popover('hide');
						isVisible = clickedAway = false;

					} else {


						clickedAway = true;

					}

				});

			jQuery("a[data-toggle=popover], button[data-toggle=popover]").popover({

				html: true,
				trigger: 'manual'

			}).click(function(e) {

				$(this).popover('show');
				$('.popover-title').append('<button type="button" class="close">&times;</button>');
				$('.close').click(function(e){

					jQuery("a[data-toggle=popover], button[data-toggle=popover]").popover('hide');

				});

				e.preventDefault();
			});


		// jQuery("a[data-toggle=popover], button[data-toggle=popover]").popover();
	}



/** 05. LightBox
 **************************************************************** **/
	function _lightbox() {
		var _el = jQuery(".lightbox");

		if(_el.length > 0) {

			loadScript(plugin_path + 'magnific-popup/jquery.magnific-popup.min.js', function() {

				if(typeof(jQuery.magnificPopup) == "undefined") {
					return false;
				}

				jQuery.extend(true, jQuery.magnificPopup.defaults, {
					tClose: 		'Close',
					tLoading: 		'Loading...',

					gallery: {
						tPrev: 		'Previous',
						tNext: 		'Next',
						tCounter: 	'%curr% / %total%'
					},

					image: 	{
						tError: 	'Image not loaded!'
					},

					ajax: 	{
						tError: 	'Content not loaded!'
					}
				});

				_el.each(function() {

					var _t 			= jQuery(this),
						options 	= _t.attr('data-plugin-options'),
						config		= {},
						defaults 	= {
							type: 				'image',
							fixedContentPos: 	false,
							fixedBgPos: 		false,
							mainClass: 			'mfp-no-margins mfp-with-zoom',
							closeOnContentClick: true,
							closeOnBgClick: 	true,
							image: {
								verticalFit: 	true
							},

							zoom: {
								enabled: 		false,
								duration: 		300
							},

							gallery: {
								enabled: false,
								navigateByImgClick: true,
								preload: 			[0,1],
								arrowMarkup: 		'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
								tPrev: 				'Previous',
								tNext: 				'Next',
								tCounter: 			'<span class="mfp-counter">%curr% / %total%</span>'
							},
						};

					if(_t.data("plugin-options")) {
						config = jQuery.extend({}, defaults, options, _t.data("plugin-options"));
					}

					jQuery(this).magnificPopup(config);

				});

			});

		}

	}





/** Toggle
 **************************************************************** **/
	function _toggle() {

		var $_t = this,
			previewParClosedHeight = 25;

		jQuery("div.toggle.active > p").addClass("preview-active");
		jQuery("div.toggle.active > div.toggle-content").slideDown(400);
		jQuery("div.toggle > label").click(function(e) {

			var parentSection 	= jQuery(this).parent(),
				parentWrapper 	= jQuery(this).parents("div.toggle"),
				previewPar 		= false,
				isAccordion 	= parentWrapper.hasClass("toggle-accordion");

			if(isAccordion && typeof(e.originalEvent) != "undefined") {
				parentWrapper.find("div.toggle.active > label").trigger("click");
			}

			parentSection.toggleClass("active");

			if(parentSection.find("> p").get(0)) {

				previewPar 					= parentSection.find("> p");
				var previewParCurrentHeight = previewPar.css("height");
				var previewParAnimateHeight = previewPar.css("height");
				previewPar.css("height", "auto");
				previewPar.css("height", previewParCurrentHeight);

			}

			var toggleContent = parentSection.find("> div.toggle-content");

			if(parentSection.hasClass("active")) {

				jQuery(previewPar).animate({height: previewParAnimateHeight}, 350, function() {jQuery(this).addClass("preview-active");});
				toggleContent.slideDown(350);

			} else {

				jQuery(previewPar).animate({height: previewParClosedHeight}, 350, function() {jQuery(this).removeClass("preview-active");});
				toggleContent.slideUp(350);

			}

		});
	}




/** Charts
 **************************************************************** **/
	function _charts(ajax) {


		/** Sparkline Graph

			USAGE

			<div class="sparkline" data-plugin-options='{"type":"bar","barColor":"#2E363F","height":"26px","barWidth":"5","barSpacing":"2"}'>
				9,6,5,6,6,7,7,6,7,8,9,7
			</div>

			PLugin options
			http://omnipotent.net/jquery.sparkline/#s-docs
		 **************************************************************** **/
		if(jQuery(".sparkline").length > 0) {

			loadScript(plugin_path + 'chart.sparkline/jquery.sparkline.min.js', function() {

				if(jQuery().sparkline) {

					if(ajax === true) {

						jQuery('#middle .sparkline').each(function() {
							jQuery(this).sparkline('html', jQuery(this).data("plugin-options"));
						});

					} else {

						jQuery('.sparkline').each(function() {
							jQuery(this).sparkline('html', jQuery(this).data("plugin-options"));
						});

					}

				}

			});

		}



		/** easyPiechart

			USAGE
			<span class="easyPieChart" data-percent="86" data-easing="easeOutBounce" data-barColor="#ef1e25" data-trackColor="#dddddd" data-scaleColor="#dddddd" data-size="110" data-lineWidth="6">
				<span class="percent"></span>
			</span>
		 **************************************************************** **/
		if(jQuery(".easyPieChart").length > 0) {

			loadScript(plugin_path + 'chart.easypiechart/jquery.easypiechart.min.js', function() {

				if(jQuery().easyPieChart) {

					jQuery(".easyPieChart").each(function() {

						// Set Width
						var _size= jQuery(this).attr('data-size') || '110';
						jQuery(this).width(_size);
						jQuery(this).height(_size);

						// Render
						jQuery(this).easyPieChart({

							easing: 		jQuery(this).attr('data-easing') 		|| '',
							barColor: 		jQuery(this).attr('data-barColor') 		|| '#ef1e25',
							trackColor: 	jQuery(this).attr('data-trackColor') 	|| '#dddddd',
							scaleColor: 	jQuery(this).attr('data-scaleColor') 	|| '#dddddd',
							size: 			jQuery(this).attr('data-size') 			|| '110',
							lineWidth:		jQuery(this).attr('data-lineWidth') 	|| '6',
							lineCap:		'circle',

							onStep: function(from, to, percent) {
								jQuery(this.el).find('.percent').text(Math.round(percent));
							}

						});

					});

				}

			});

		}



		/** Knob
		 **************************************************************** **/
		if(jQuery("input.knob").length > 0) {

			loadScript(plugin_path + 'chart.knob/dist/jquery.knob.min.js', function() {

				if(jQuery().knob) {

					jQuery("input.knob").knob({
						'dynamicDraw': 			true,
						'thickness': 			jQuery(this).attr('data-thickness') || 0.1,
						'tickColorizeValues': 	true,
						'skin': 				'tron'
					});

				}

			});

		}

	}


/** Autosuggest
	http://twitter.github.io/typeahead.js/
 **************************************************************** **/
	function _autosuggest() {
		_container = jQuery('div.autosuggest');

		if(_container.length > 0) {

			loadScript(plugin_path + 'typeahead.bundle.js', function() {

				if(jQuery().typeahead) {

					_container.each(function() {
						var	_t 					= jQuery(this),
							_minLength			= _t.attr('data-minLength') || 1,
							_qryURL 			= _t.attr('data-queryURL'),
							_limit	 			= _t.attr('data-limit') 	|| 10,
							_autoload 			= _t.attr('data-autoload');

							if(_autoload == "false") {
								return false;
							}

							/** **/
							/* Bloodhound (Suggestion Engine) */
							var _typeahead = new Bloodhound({
								datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
								queryTokenizer: Bloodhound.tokenizers.whitespace,
								limit:	_limit,
								remote: {
									url: _qryURL + '%QUERY',
								},
 							});

							jQuery('.typeahead', _t).typeahead({
								limit: 		_limit,
								hint: 		_t.attr('data-hint') 		== "false" ? false : true,
								highlight: 	_t.attr('data-highlight') 	== "false" ? false : true,
								minLength: parseInt(_minLength),

								cache: 			false,
							},
							{
								name: '_typeahead',
								source: _typeahead
							});
							/** **/

					});


				}

			});

		}

	}




/** Form [form plugin + validation plugin]
 **************************************************************** **/
	function _form() {


		/** Form Validate
			LOAD PLUGIN ONLY!
		 ************************ **/
		if(jQuery('form.validate-plugin').length > 0) {

			loadScript(plugin_path + 'form.validate/jquery.form.min.js', function() {
				loadScript(plugin_path + 'form.validate/jquery.validation.min.js');
			});

		}



		/** Form Validate
		 ************************ **/
		if(jQuery('form.validate').length > 0) {

			loadScript(plugin_path + 'form.validate/jquery.form.min.js', function() {
				loadScript(plugin_path + 'form.validate/jquery.validation.min.js', function() {

					if(jQuery().validate) {

						jQuery('form.validate').each(function() {

							var _t 			= jQuery(this),
								_Smessage 	= _t.attr('data-success') 			|| "Successfully! Thank you!",
								_Cmessage 	= _t.attr('data-captcha') 			|| "Invalid Captcha!",
								_Tposition 	= _t.attr('data-toastr-position') 	|| "top-right",
								_Ttype	 	= _t.attr('data-toastr-type') 		|| "success";
								_Turl	 	= _t.attr('data-toastr-url') 		|| false;

							// Append 'is_ajax' hidden input field!
							_t.append('<input type="hidden" name="is_ajax" value="true" />');

							_t.validate({
								submitHandler: function(form) {

									// Show spin icon
									jQuery(form).find('.input-group-addon').find('.fa-envelope').removeClass('fa-envelope').addClass('fa-refresh fa-spin');

									jQuery(form).ajaxSubmit({

										target: 	jQuery(form).find('.validate-result').length > 0 ? jQuery(form).find('.validate-result') : '',

										error: 		function(data) {
											_toastr("Sent Failed!",_Tposition,"error",false);
										},

										success: 	function(data) {
											var data = data.trim();

											// SMTP ERROR
											if(data == '_failed_') {
												_toastr("SMTP ERROR! Please, check your config file!",_Tposition,"error",false);
											}

											// CAPTCHA ERROR
											else if(data == '_captcha_') {
												_toastr("Invalid Captcha!",_Tposition,"error",false);


											// SUCCESS
											} else {

												// Remove spin icon
												jQuery(form).find('.input-group-addon').find('.fa-refresh').removeClass('fa-refresh fa-spin').addClass('fa-envelope');

												// Clear the form
												jQuery(form).find('input.form-control').val('');

												// Toastr Message
												_toastr(_Smessage,_Tposition,_Ttype,_Turl);

											}
										}
									});

								}
							});

						});

					}

				});
			});

		}




		/** Masked Input
		 ************************ **/
		var _container = jQuery('input.masked');
		if(_container.length > 0) {

			loadScript(plugin_path + 'form.masked/jquery.maskedinput.js', function() {

				_container.each(function() {

					var _t 				= jQuery(this);
						_format 		= _t.attr('data-format') 		|| '(999) 999-999999',
						_placeholder 	= _t.attr('data-placeholder') 	|| 'X';

					jQuery.mask.definitions['f'] = "[A-Fa-f0-9]";
					_t.mask(_format, {placeholder:_placeholder});

				});

			});

		}

	}





/** Select2
 **************************************************************** **/
	function _select2() {
		var _container = jQuery('select.select2');

		if(_container.length > 0) {

			loadScript(plugin_path + 'select2/js/select2.full.min.js', function() {

				if(jQuery().select2) {
					jQuery('select.select2').select2();
				}

			});
		}

	}



/** Form Stepper
 **************************************************************** **/
	function _stepper() {
		var _container = jQuery('input.stepper');

		if(_container.length > 0) {

			loadScript(plugin_path + 'form.stepper/jquery.stepper.min.js', function() {

				if(jQuery().stepper) {

					jQuery(_container).each(function() {
						var _t 		= jQuery(this),
							_min 	= _t.attr('min') || null,
							_max 	= _t.attr('max') || null;

						_t.stepper({
							limit:						[_min,_max],
							floatPrecission:			_t.attr('data-floatPrecission') || 2,
							wheel_step: 				_t.attr('data-wheelstep') 		|| 0.1,
							arrow_step:	 				_t.attr('data-arrowstep') 		|| 0.2,
							allowWheel: 				_t.attr('data-mousescrool') 	== "false" ? false : true,
							UI: 						_t.attr('data-UI') 				== "false" ? false : true,
							// --
							type: 						_t.attr('data-type') 			|| "float",
							preventWheelAcceleration:	_t.attr('data-preventWheelAcceleration') == "false" ? false : true,
							incrementButton:			_t.attr('data-incrementButton') || "&blacktriangle;",
							decrementButton:			_t.attr('data-decrementButton') || "&blacktriangledown;",
							onStep:						null,
							onWheel:					null,
							onArrow:					null,
							onButton:					null,
							onKeyUp:					null
						});

					});

				}

			});

		}

	}



/** Pickers
 **************************************************************** **/
	function _pickers() {

		/** Date Picker
			<input type="text" class="form-control datepicker" data-format="yyyy-mm-dd" data-lang="en" data-RTL="false">
		 ******************* **/
		var _container_1 = jQuery('.datepicker');

		if(_container_1.length > 0) {
			loadScript(plugin_path + 'bootstrap.datepicker/js/bootstrap-datepicker.min.js', function() {

				if(jQuery().datepicker) {

					_container_1.each(function() {
						var _t 		= jQuery(this),
							_lang 	=	_t.attr('data-lang') || 'en';

						if(_lang != 'en' && _lang != '') { // load language file
							loadScript(plugin_path + 'bootstrap.datepicker/locales/bootstrap-datepicker.'+_lang+'.min.js');
						}

						jQuery(this).datepicker({
							format:			_t.attr('data-format') 			|| 'yyyy-mm-dd',
							language: 		_lang,
							rtl: 			_t.attr('data-RTL') 			== "true"  ? true  : false,
							changeMonth: 	_t.attr('data-changeMonth') 	== "false" ? false : true,
							todayBtn: 		_t.attr('data-todayBtn') 		== "false" ? false : "linked",
							calendarWeeks: 	_t.attr('data-calendarWeeks') 	== "false" ? false : true,
							autoclose: 		_t.attr('data-autoclose') 		== "false" ? false : true,
							todayHighlight: _t.attr('data-todayHighlight') 	== "false" ? false : true,

							onRender: function(date) {
								// return date.valueOf() < nowDate.valueOf() ? 'disabled' : '';
							}
						}).on('changeDate', function(ev) {

							// AJAX POST - OPTIONAL

						}).data('datepicker');
					});

				}

			});
		}




		/** Range Picker
			<input type="text" class="form-control rangepicker" value="2015-01-01 - 2016-12-31" data-format="yyyy-mm-dd" data-from="2015-01-01" data-to="2016-12-31">
		 ******************* **/
		var _container_2 = jQuery('.rangepicker');

		if(_container_2.length > 0) {
			loadScript(plugin_path + 'bootstrap.daterangepicker/moment.min.js', function() {
				loadScript(plugin_path + 'bootstrap.daterangepicker/daterangepicker.js', function() {

					if(jQuery().datepicker) {

						_container_2.each(function() {

							var _t 		= jQuery(this),
								_format = _t.attr('data-format').toUpperCase() || 'YYYY-MM-DD';

							_t.daterangepicker(
							{
								format: 		_format,
								startDate: 		_t.attr('data-from'),
								endDate: 		_t.attr('data-to'),

								ranges: {
								   'Today': [moment(), moment()],
								   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
								   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
								   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
								   'This Month': [moment().startOf('month'), moment().endOf('month')],
								   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
								}
							},
							function(start, end, label) {
								// alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
							});

						});

					}

				});
			});
		}



		/** Time Picker
			<input type="text" class="form-control timepicker" value="11 : 55 : PM">
		 ******************* **/
		var _container_3 = jQuery('.timepicker');

		if(_container_3.length > 0) {
			loadScript(plugin_path + 'timepicki/timepicki.min.js', function() {

				if(jQuery().timepicki) {

					_container_3.timepicki();

				}

			});
		}



		/** Color Picker
		 ******************* **/
		var _container_4 = jQuery('.colorpicker');

		if(_container_4.length > 0) {
			loadScript(plugin_path + 'spectrum/spectrum.min.js', function() {

				if(jQuery().spectrum) {

					_container_4.each(function() {
						var _t 					= jQuery(this),
							_preferredFormat 	= _t.attr('data-format') 		|| "hex", // hex, hex3, hsl, rgb, name
							_palletteOnly		= _t.attr('data-palletteOnly') 	|| "false",
							_fullPicker			= _t.attr('data-fullpicker') 	|| "false",
							_allowEmpty			= _t.attr('data-allowEmpty') 	|| false;
							_flat				= _t.attr('data-flat') 			|| false;

							if(_palletteOnly == "true" || _fullPicker == "true") {

								var _palette = [
										["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
										["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
										["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
										["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
										["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
										["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
										["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
										["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
									];

							} else {
								_palette = null;
							}

							if(_t.attr('data-defaultColor')) {
								_color = _t.attr('data-defaultColor');
							} else {
								_color = "#ff0000";
							}

							if(!_t.attr('data-defaultColor') && _allowEmpty == "true") {
								_color = null;
							}

						_t.spectrum({
							showPaletteOnly: 	_palletteOnly == "true" ? true : false,
							togglePaletteOnly: 	_palletteOnly == "true" ? true : false,

							flat:				_flat 		== "true" ? true : false,
							showInitial: 		_allowEmpty == "true" ? true : false,
							showInput: 			_allowEmpty == "true" ? true : false,
							allowEmpty:			_allowEmpty == "true" ? true : false,

							chooseText: 		_t.attr('data-chooseText') || "Coose",
							cancelText: 		_t.attr('data-cancelText') || "Cancel",

							color: 				_color,
							showInput:			true,
							showPalette: 		true,
							preferredFormat: 	_preferredFormat,
							showAlpha: 			_preferredFormat == "rgb" ? true : false,
							palette: 			_palette
						});

					});

				}

			});
		}

	}




/** Editors
 **************************************************************** **/
	function _editors() {

		/** Summernote HTML Editor
			<textarea class="summernote form-control" data-height="200"></textarea>
		 ***************************** **/
		var _container_1 = jQuery('textarea.summernote');

		if(_container_1.length > 0) {

			loadScript(plugin_path + 'editor.summernote/summernote.min.js', function() {

				if(jQuery().summernote) {

					_container_1.each(function() {

						var _lang = jQuery(this).attr('data-lang') || 'en-US';

						if(_lang != 'en-US') { // Language!
						alert(_lang);
							loadScript(plugin_path + 'editor.summernote/lang/summernote-'+_lang+'.js');
						}

						jQuery(this).summernote({
							height: jQuery(this).attr('data-height') || 200,
							lang: 	jQuery(this).attr('data-lang') || 'en-US', // default: 'en-US'
							toolbar: [
							/*	[groupname, 	[button list]]	*/
								['style', 		['style']],
								['fontsize', 	['fontsize']],
								['style', 		['bold', 'italic', 'underline','strikethrough', 'clear']],
								['color', 		['color']],
								['para', 		['ul', 'ol', 'paragraph']],
								['table', 		['table']],
								['media', 		['link', 'picture', 'video']],
								['misc', 		['codeview', 'fullscreen', 'help']]
							]
						});
					});

				}
			});
		}





		/** Markdown HTML Editor
			<textarea class="markdown" data-height="300" name="content" data-provide="markdown" data-lang="en" rows="10"></textarea>
		 ***************************** **/
		var _container_2 = jQuery('textarea.markdown');

		if(_container_2.length > 0) {

			loadScript(plugin_path + 'editor.markdown/js/bootstrap-markdown.min.js', function() {

				if(jQuery().markdown) {

					_container_2.each(function() {
						var _t = jQuery(this);

						var _lang = _t.attr('data-lang') || 'en';

						if(_lang != 'en') { // Language!
							loadScript(plugin_path + 'editor.markdown/locale/bootstrap-markdown.'+_lang+'.js');
						}

						jQuery(this).markdown({
							autofocus:		_t.attr('data-autofocus') 	== "true" ? true : false,
							savable:		_t.attr('data-savable') 	== "true" ? true : false,
							height:			_t.attr('data-height') 		|| 'inherit',
							language:		_lang == 'en' ? null : _lang
						});

					});

				}

			});

		}

	}




/** Misc
	Various Functions
 **************************************************************** **/
	function _misc() {


		/** Masonry
		 *********************** **/
		if(jQuery().masonry) {
			jQuery(".masonry").masonry();
		}


		/** Increase / Decrease No.
		 *********************** **/
		jQuery(".incr").bind("click", function(e) {
			e.preventDefault();

			var _for	= jQuery(this).attr('data-for'),
				_max	= parseInt(jQuery(this).attr('data-max')),
				_curVal	= parseInt(jQuery("#" + _for).val());

			if(_curVal < _max) {
				jQuery("#" + _for).val(_curVal + 1);
			}
		});

		jQuery(".decr").bind("click", function(e) {
			e.preventDefault();

			var _for	= jQuery(this).attr('data-for'),
				_min	= parseInt(jQuery(this).attr('data-min')),
				_curVal	= parseInt(jQuery("#" + _for).val());

			if(_curVal > _min) {
				jQuery("#" + _for).val(_curVal - 1);
			}
		});


		/** Default Button Toggle
		 *********************** **/
		jQuery("a.toggle-default").bind("click", function(e) {
			e.preventDefault();

			var _href = jQuery(this).attr('href');

			if(jQuery(_href).is(":hidden")) {

				jQuery(_href).slideToggle(200);
				jQuery('i.fa', this).removeClass('fa-plus-square').addClass('fa-minus-square');

			} else {

				jQuery(_href).slideToggle(200);
				jQuery('i.fa', this).removeClass('fa-minus-square').addClass('fa-plus-square');

			}

		});


		/** Custom File Upload
			<input class="custom-file-upload" type="file" id="file" name="myfiles[]" multiple />
		 *********************** **/
		var file_container = jQuery("input[type=file]");

		if(file_container.length > 0) {
			loadScript(plugin_path + 'custom.fle_upload.js');
		}


		/** Textarea Words Limit
		 *********************** **/
		jQuery("textarea.word-count").on('keyup', function() {
			var _t		= jQuery(this),
				words 	= this.value.match(/\S+/g).length,
				_limit	= _t.attr('data-maxlength') || 200;

			if (words > parseInt(_limit)) {

				// Split the string on first 200 words and rejoin on spaces
				var trimmed = _t.val().split(/\s+/, 200).join(" ");
				// Add a space at the end to keep new typing making new words
				_t.val(trimmed + " ");

			} else {

				var _data_info = _t.attr('data-info');

				if(_data_info == '' || _data_info == undefined) {
					var _infoContainer = _t.next('div');
					jQuery('span', _infoContainer).text(words + '/' + _limit);
				} else {
					jQuery('#' +_data_info).text(words + '/' + _limit);
				}


			}
		});

		// Count To
        jQuery(".countTo").appear(function(){
			var _t 					= jQuery(this),
				_from 				= _t.attr('data-from') 				|| 0,
				_speed 				= _t.attr('data-speed') 			|| 1300,
				_refreshInterval 	= _t.attr('data-refreshInterval') 	|| 60;


            _t.countTo({
                from: 				parseInt(_from),
                to: 				_t.html(),
                speed: 				parseInt(_speed),
                refreshInterval: 	parseInt(_refreshInterval),
                formatter: function (value, options) {
				    value = value.toFixed(options.decimals);
				    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				    return value;
				  }
            });

        });

        jQuery(".wow").appear(function(){
			new WOW().init();
        });
	}




/** Fullscreen
 **************************************************************** **/
	function _goFullScreen() {

		jQuery("#goToFullScreen").unbind();
		jQuery("#goToFullScreen").bind("click", function(e) {
			e.preventDefault();

			if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods

				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}

			} else {

				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}

			}
		});

	}





/** Placeholder
 **************************************************************** **/
	function _placeholder() {

		//check for IE
		if(navigator.appVersion.indexOf("MSIE")!=-1) {

			jQuery('[placeholder]').focus(function() {

				var input = jQuery(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
					input.removeClass('placeholder');
				}

			}).blur(function() {

				var input = jQuery(this);
				if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
				}

			}).blur();

		}

	}




/** Aside
 **************************************************************** **/
	function _aside() {

		// Mobile Button
		jQuery("#mobileMenuBtn").bind("click", function(e) {
			e.preventDefault();

			jQuery(this).toggleClass('active');

			if(window.width > 768) {

				if(jQuery('body').hasClass('min')) {
					jQuery('body').removeClass('min');
					jQuery("#middle").css({"margin-left":""});

				} else {

					jQuery("#middle").css({"margin-left":"0"});
					jQuery('body').addClass('min');

					if(jQuery('#aside nav li.el_primary.menu-open ul.sub-menu').prop('style')) {
						jQuery('#aside nav li.el_primary.menu-open ul.sub-menu').prop('style').removeProperty("display");
					}

					jQuery('#aside nav li.el_primary').removeClass('menu-open');

				}

			} else {

				if(jQuery('body').hasClass('menu-open')) {

					jQuery('body').removeClass('menu-open');
					jQuery("#middle").css({"margin-left":""});

				} else {

					jQuery("#middle").css({"margin-left":"0"});
					jQuery('body').addClass('menu-open');

					if(jQuery('#aside nav li.el_primary.menu-open ul.sub-menu').prop('style')) {
						jQuery('#aside nav li.el_primary.menu-open ul.sub-menu').prop('style').removeProperty("display");
					}

					jQuery('#aside nav li.el_primary').removeClass('menu-open');

				}

			}
		});



		/** -------------------------------------------------------------------------------------- **/
		// Add an ID for each primary LI element (first dropdown)
		count = 0;
		jQuery('#aside ul.nav > li').each(function() {
			jQuery(this).addClass('el_primary');
			jQuery(this).attr('id', 'el_' + count);
			count++;
		});


		// Multilevel Navigation
		jQuery('#aside ul.nav li a').bind("click", function(e) {

			var _t 		= jQuery(this),
				_href 	= _t.attr('href');

			if(_href == '#') {
				e.preventDefault();
			}

			var find_li = jQuery(this).closest('li');

			if(!find_li.hasClass('always-open')) {

				var _id		= find_li.attr('id');

				// Hide other open submenus
				if(find_li.hasClass('el_primary')) {
					jQuery("#aside ul.nav li>ul").each(function() {
						var __id = jQuery(this).closest('li').attr('id');
						if(__id != _id) {
							jQuery(this).slideUp(200, function() {
								jQuery(this).parent().removeClass('menu-open');
							});
						}
					});

				}


				// Slide toggle
				jQuery(this).next().slideToggle(200, function() {

					if(jQuery(this).is(":visible")) {
						find_li.addClass('menu-open');
					} else {
						find_li.removeClass('menu-open active');
					}

				});

			}

		});
		/** -------------------------------------------------------------------------------------- **/


	}


	function _asideFix() {

		if(window.width > 768) {

			if(jQuery("body").hasClass('menu-open')) {
				if (jQuery("body").hasClass('min')) {
					jQuery("#middle").css({"margin-left":"0px"});
				} else {
					jQuery("#middle").css({"margin-left":""});
				}
				/*jQuery("#middle").css({"margin-left":""});*/
			}

		}

	}





/** Panels
 **************************************************************** **/
	function _panels() {

		// Panel Collapse
		jQuery('#middle div.panel ul.options>li>a.panel_colapse').bind("click", function(e) {
			e.preventDefault();

			var panel 			= jQuery(this).closest('div.panel'),
				button 			= jQuery(this),
				panel_body 		= jQuery('div.panel-body', panel),
				panel_footer 	= jQuery('div.panel-footer', panel),
				panel_id		= panel.attr('id');

			panel_footer.slideToggle(200);
			panel_body.slideToggle(200, function() {

			if(panel_body.is(":hidden")) {

				// Add to localStorage
				if(panel_id != '' && panel_id != undefined) {
					localStorage.setItem(panel_id, 'hidden');
				}

			} else {

				// Remove from localStorage
				localStorage.removeItem(panel_id);

			}

			});

			button.toggleClass('plus').toggleClass('');
		});


		// On Load - hide|show panel from cookie
		jQuery("#middle div.panel").each(function() {

			var panel 			= jQuery(this),
				panel_body 		= jQuery('div.panel-body', panel),
				panel_footer 	= jQuery('div.panel-footer', panel),
				panel_id		= panel.attr('id'),
				panel_state		= localStorage.getItem(panel_id),
				button 			= jQuery('a.panel_colapse', panel);

			// [COLLAPSE] ON LOAD
			if(panel_state == 'hidden') {
				panel_body.slideToggle(0);
				panel_footer.slideToggle(0);
				button.toggleClass('plus').toggleClass('');
			}

			// [REMOVE] ON LOAD
			if(panel_state == 'removed') {
				jQuery("#" + panel_id).remove();
			}

		});






		// Panel Close
		jQuery('#middle div.panel ul.options>li>a.panel_close').bind("click", function(e) {
			e.preventDefault();

			var panel 	= jQuery(this).closest('div.panel'),
			panel_id	= panel.attr('id');

			jQuery(panel).fadeOut(300, function() {
				jQuery(this).remove();

				// FUNCTION ON custom.js
				if (typeof _closePanel == 'function') {
					_closePanel(panel_id);
				}
			});
		});






		// Panel Fullscreen
		jQuery('#middle div.panel ul.options>li>a.panel_fullscreen').bind("click", function(e) {
			e.preventDefault();

			var panel 			= jQuery(this).closest('div.panel'),
				panel_close 	= jQuery('a.panel_close', panel).closest('li');
				panel_colapse 	= jQuery('a.panel_colapse', panel).closest('li');

			panel.toggleClass('fullscreen').toggleClass('');
			panel_close.toggleClass('hide').toggleClass('');
			panel_colapse.toggleClass('hide').toggleClass('');

			// Disable Scroll
			if(panel.hasClass('fullscreen')) {
				disable_scroll();
			} else {
				enable_scroll();
			}

		});





		// Esc key Events
		document.onkeydown = function(evt) {
			evt = evt || window.event;
			if (evt.keyCode == 27) {

				// Close fullscreen panel
				var current_panel_fullscreen = jQuery("#middle div.panel.fullscreen");

				if(current_panel_fullscreen.length > 0) {

					panel_close 	= jQuery('a.panel_close', current_panel_fullscreen).closest('li');
					panel_colapse 	= jQuery('a.panel_colapse', current_panel_fullscreen).closest('li');

					panel_close.removeClass('hide');
					panel_colapse.removeClass('hide');
					current_panel_fullscreen.removeClass('fullscreen');
				}
				// --

			}
		};

	}

/** Modal Autoload

	USAGE:

	<div id="MODAL-ID-REQUIRED" class="modal fade" data-autoload="true" data-autoload-delay="2000">
		...
	</div>
 **************************************************************** **/
	function _modalAutoLoad() {
		if(jQuery("div.modal").length > 0) {

			jQuery("div.modal").each(function() {
				var _t 			= jQuery(this),
					_id			= _t.attr('id'),
					_autostart 	= _t.attr('data-autoload') || false;


				// reset allow
				// localStorage.removeItem(_id);


				if(_id != '') { // rewrite if set to hidden by the user
					if(localStorage.getItem(_id) == 'hidden') {
						_autostart = 'false';
					}
				}


				if(_autostart == 'true') {

					jQuery(window).load(function() { // required on load!
						var _delay = _t.attr('data-autoload-delay') || 1000; // delay when modal apprear

						setTimeout(
							function()  {

								_t.modal('toggle');

						}, parseInt(_delay));

					});

				}

				// LOCAL STORAGE - DO NOT HIDE ON NEXT PAGE LOAD!
				jQuery("input.loadModalHide", this).bind("click", function() {
					var _tt = jQuery(this);

					if(_tt.is(":checked")) {
						localStorage.setItem(_id, 'hidden');
						console.log('[Modal Autoload #'+_id+'] Added to localStorage');
					} else {
						localStorage.removeItem(_id);
						console.log('[Modal Autoload #'+_id+'] Removed from localStorage');
					}

				});

			});

		}
	}



/** Toastr

	TYPE:
		primary
		info
		error
		sucess
		warning

	POSITION
		top-right
		top-left
		top-center
		top-full-width
		bottom-right
		bottom-left
		bottom-center
		bottom-full-width

	USAGE:
		_toastr("My Message here","top-right","error",false);

	NOTE:
		_onclick = url to redirect (example: http://www.stepofweb.com)
 **************************************************************** **/
	function _toastr(_message,_position,_notifyType,_onclick) {
		var _btn 	= jQuery(".toastr-notify");

		if(_btn.length > 0 || _message != false) {

			loadScript(plugin_path + 'toastr/toastr.js', function() {
				// toastr.clear();

				/** BUTTON CLICK
				 ********************* **/
				_btn.bind("click", function(e) {
					e.preventDefault();


					var _message 			= jQuery(this).attr('data-message'),
						_notifyType 		= jQuery(this).attr('data-notifyType')			|| "default",
						_position	 		= jQuery(this).attr('data-position')			|| "top-right",
						_progressBar 		= jQuery(this).attr('data-progressBar') 		== "true" ? true : false,
						_closeButton		= jQuery(this).attr('data-closeButton') 		== "true" ? true : false,
						_debug		 		= jQuery(this).attr('data-debug') 				== "true" ? true : false,
						_newestOnTop 		= jQuery(this).attr('data-newestOnTop') 		== "true" ? true : false,
						_preventDuplicates	= jQuery(this).attr('data-preventDuplicates') 	== "true" ? true : false,
						_showDuration 		= jQuery(this).attr('data-showDuration') 		|| "300",
						_hideDuration 		= jQuery(this).attr('data-hideDuration') 		|| "1000",
						_timeOut 			= jQuery(this).attr('data-timeOut') 			|| "5000",
						_extendedTimeOut	= jQuery(this).attr('data-extendedTimeOut')		|| "1000",
						_showEasing 		= jQuery(this).attr('data-showEasing') 			|| "swing",
						_hideEasing 		= jQuery(this).attr('data-hideEasing') 			|| "linear",
						_showMethod 		= jQuery(this).attr('data-showMethod') 			|| "fadeIn",
						_hideMethod 		= jQuery(this).attr('data-hideMethod') 			|| "fadeOut";

						toastr.options = {
							"closeButton": 			_closeButton,
							"debug": 				_debug,
							"newestOnTop": 			_newestOnTop,
							"progressBar": 			_progressBar,
							"positionClass": 		"toast-" + _position,
							"preventDuplicates": 	_preventDuplicates,
							"onclick": 				null,
							"showDuration": 		_showDuration,
							"hideDuration": 		_hideDuration,
							"timeOut": 				_timeOut,
							"extendedTimeOut": 		_extendedTimeOut,
							"showEasing": 			_showEasing,
							"hideEasing": 			_hideEasing,
							"showMethod": 			_showMethod,
							"hideMethod": 			_hideMethod
						}

					toastr[_notifyType](_message);
				});


				/** JAVSCRIPT / ON LOAD
				 ************************* **/
				if(_message != false) {

					if(_onclick != false) {
						onclick = function() {
							window.location = _onclick;
						}
					} else {
						onclick = null
					}

					toastr.options = {
						"closeButton": 			true,
						"debug": 				false,
						"newestOnTop": 			false,
						"progressBar": 			true,
						"positionClass": 		"toast-" + _position,
						"preventDuplicates": 	false,
						"onclick": 				onclick,
						"showDuration": 		"300",
						"hideDuration": 		"1000",
						"timeOut": 				"5000",
						"extendedTimeOut": 		"1000",
						"showEasing": 			"swing",
						"hideEasing": 			"linear",
						"showMethod": 			"fadeIn",
						"hideMethod": 			"fadeOut"
					}

					setTimeout(function(){
						toastr[_notifyType](_message);
					}, 1500); // delay 1.5s
				}
			});

		}

	}

	function _confirmRemoval() {
		$("#remove-btn").bind("click", function(e) {
			e.preventDefault();

			swal({
				title: "Are you sure?",
				//text: "You will still be able to redo this action within 3 days!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes!",
				cancelButtonText: "No",
				showLoaderOnConfirm: true,
				closeOnConfirm: false },
				function() {
					setTimeout(function() {
						swal("Removal request sent!", "Your removal request has been sent.", "success");

						$(".assetTable tbody input:checked").each(function() {
							$(this).prop('disabled', 'disabled').prop('checked', false);
							var parentTr = $(this).parents('tr');
							parentTr.removeClass('active');

							var _currentDate = moment().format("MMM DD YYYY, HH:mm");
							var _cost = $(this).next().val();
							var _item = $(this).parent().next().html();
							var _desc = "Requested to remove " + _item + " - $" + _cost;

							var _status = parentTr.find('span.label-warning');
							_status.removeClass('label-warning').addClass('label-success').text("Yes");

							$("#no-items").text("0");
							$("#est-cost").text("0.00");

							$(".no-removal").remove();
							$(".timeline").removeClass('hide');
							$(".timeline").prepend(
								$('<li>').append(
									$("<p>")
										.append(
											$('<span>').addClass('wow fadeInRight').data('wow-delay', '0.1s').append(_desc)
										).append(
											$('<span>').addClass('timeline-icon wow fadeIn').data('wow-delay', '0.2s').append(
													$('<i>').addClass('fa fa-recycle color-green')
												)
										).append(
											$('<span>').addClass('timeline-date wow fadeInUp').data('wow-delay', '0.3s').append(_currentDate)
										)
								)
							);

							var idx = parentTr.data('index');
							var removedApp = sessionStorage.getItem('removedApp');
							if (removedApp == null) {
								removedApp = [];
							} else {
								removedApp = JSON.parse(removedApp);
							}
							removedApp.push({
								'id': 'APP' + (idx + 1),
								'cost': _cost,
								'description': _item,
								'removedDate': _currentDate
							});
							sessionStorage.setItem('removedApp', JSON.stringify(removedApp));
						});

						var removalCount = 0, removalAmount = 0;
						var removedApp = sessionStorage.getItem('removedApp');
						if (removedApp) {
							removedApp = JSON.parse(removedApp);

							removalCount = removedApp.length;
							$.each(removedApp, function(i, obj) {
								removalAmount += parseFloat(obj.cost);
							});
						}

						$('span.removal-count').text(removalCount);
						$('span.removal-amount').text(removalAmount);

					}, 2000);
			});
		});

		$("#submit-message-btn").bind("click", function(e) {
			e.preventDefault();

			swal({
				title: "Are you sure?",
				text: "You will still be able to redo this action within 3 days!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes!",
				showLoaderOnConfirm: true,
				closeOnConfirm: false },
				function(){
					setTimeout(function(){
						swal("Message sent!", "Your message has been sent. Expect a reply from us soon!", "success");
					}, 2000);
			});
		});
	}

/** Countdown
 **************************************************************** **/
	function _countDown() {
		var _container 	= jQuery(".countdown"),
			_container2 = jQuery(".countdown-download");

		if(_container.length > 0 || _container2.length > 0) {

			loadScript(plugin_path + 'countdown/jquery.countdown.pack.min.js', function() {

				/** On Page Load **/
				_container.each(function() {
					var _t 		= jQuery(this),
						_date 	= _t.attr('data-from'),
						_labels	= _t.attr('data-labels');

						if(_labels) {
							_labels = _labels.split(",");
						}

						if(_date) {
							var _d = new Date(_date);
							jQuery(this).countdown({
								until: new Date(_d),
								labels: _labels || ["Years","Months","Weeks","Days","Hours","Minutes","Seconds"]
							});
						}
				});


				/** Download **/
				_container2.bind("click", function(e){
					e.preventDefault();

					var _t = jQuery(this),
						cd_container 	= _t.attr('data-for'),
						_countdown		= jQuery("#"+cd_container+' span.download-wait>.countdown'),
						_seconds 		= parseInt(_t.attr('data-seconds')),
						_dataURL		= _t.attr('href');

					_t.fadeOut(250, function(){
						jQuery("#"+cd_container).fadeIn(250, function() {

							var currentDate = new Date();
							currentDate.setSeconds(currentDate.getSeconds() + _seconds);

							_countdown.countdown({
								until: currentDate,
								format: 'S',
								expiryUrl: _dataURL,
								onExpiry: function(){
									jQuery("#"+cd_container+' span.download-message').removeClass('hide');
									jQuery("#"+cd_container+' span.download-wait').addClass('hide');
								}
							});

						});
					});

					return false;

				});


			});

		}

	}

function calculateCost(tableName, ele) {
	var totalCost = 0;
	var itemsSelected = 0;
	if (ele != null) {
		jQuery(ele).parents('tr').toggleClass("active");
	}

	$('#' + tableName + ' tbody input:checkbox:checked').each(function() {
		totalCost += parseFloat($(this).next().val());
		itemsSelected++;
	});

	if (totalCost == '-0.00') {
		totalCost = '0.00';
	}

	$("#no-items").parent().addClass('bold');
	$("#no-items").countTo({
        from: 				parseFloat($("#no-items").html()),
        to: 				itemsSelected,
        speed: 				800,
        formatter: function (value, options) {
			value = value.toFixed(0);
			value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return value;
		},
		onComplete: function (value) {
			$("#no-items").parent().removeClass('bold');
		}
    });

	$("#est-cost").parent().addClass('bold');
	$("#est-cost").countTo({
        from: 				parseFloat($("#est-cost").html()),
        to: 				totalCost,
        speed: 				800,
        formatter: function (value, options) {
			value = value.toFixed(2);
			value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			if (value == '-0.00') {
				value = '0.00';
			}
			return value;
		},
		onComplete: function (value) {
			$("#est-cost").parent().removeClass('bold');
		}
    });
}

function _initDate() {
	if ($("[data-history-month]").length > 0) {
		loadScript(plugin_path + 'bootstrap.daterangepicker/moment.min.js', function() {
			$("[data-history-month]").each(function() {
				var _historyMonth = parseInt($(this).data('history-month'));
				var _currentDate = moment().subtract(_historyMonth, "months");

				if ($(this).data('history-date') != null) {
					var _historyDate = parseInt($(this).data('history-date'));
					_currentDate = _currentDate.date(_historyDate);
				}

				var _dateFormat = $(this).data('date-format') || 'YYYY-MM-DD';
				_currentDate = _currentDate.format(_dateFormat);

				$('.active-date', this).text(_currentDate);

				if (_historyMonth > 2 && _historyMonth <= 6) {
					$('.glyphicon-time', this).addClass('text-orange').attr('title', 'Rarely used (More than ' + _historyMonth + ' months)');
				} else if (_historyMonth > 6) {
					$('.glyphicon-time', this).addClass('text-red').attr('title', 'Rarely used (More than ' + _historyMonth + ' months)');
				} else {
					$('.glyphicon-time', this).addClass('text-green').attr('title', 'Recently used');
				}
			});
		});
	}
}

/** ***************************************** DO NOT EDIT BELOW HERE *********************************************** **/
/** ***************************************** DO NOT EDIT BELOW HERE *********************************************** **/
/** ***************************************** DO NOT EDIT BELOW HERE *********************************************** **/
/** ***************************************** DO NOT EDIT BELOW HERE *********************************************** **/
/** ***************************************** DO NOT EDIT BELOW HERE *********************************************** **/



	// scroll
	function wheel(e) {
	  e.preventDefault();
	}

	function disable_scroll() {
	  if (window.addEventListener) {
		  window.addEventListener('DOMMouseScroll', wheel, false);
	  }
	  window.onmousewheel = document.onmousewheel = wheel;
	}

	function enable_scroll() {
		if (window.removeEventListener) {
			window.removeEventListener('DOMMouseScroll', wheel, false);
		}
		window.onmousewheel = document.onmousewheel = document.onkeydown = null;
	}

	// overlay
	function enable_overlay() {
		jQuery("span.global-overlay").remove(); // remove first!
		jQuery('body').append('<span class="global-overlay"></span>');
	}
	function disable_overlay() {
		jQuery("span.global-overlay").remove();
	}


/** COUNT TO
	https://github.com/mhuggins/jquery-countTo
 **************************************************************** **/
 (function ($) {
	$.fn.countTo = function (options) {
		options = options || {};

		return jQuery(this).each(function () {
			// set options for current element
			var settings = jQuery.extend({}, $.fn.countTo.defaults, {
				from:            jQuery(this).data('from'),
				to:              jQuery(this).data('to'),
				speed:           jQuery(this).data('speed'),
				refreshInterval: jQuery(this).data('refresh-interval'),
				decimals:        jQuery(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = jQuery(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// __construct the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

/** Browser Detect
	Add browser to html class
 **************************************************************** **/
(function($) {
	$.extend({

		browserDetect: function() {

			var u = navigator.userAgent,
				ua = u.toLowerCase(),
				is = function (t) {
					return ua.indexOf(t) > -1;
				},
				g = 'gecko',
				w = 'webkit',
				s = 'safari',
				o = 'opera',
				h = document.documentElement,
				b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua)) ? ('ie ie' + parseFloat(navigator.appVersion.split("MSIE")[1])) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? o + (/version\/(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery1 : (/opera(\s|\/)(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery2 : '')) : is('konqueror') ? 'konqueror' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.jQuery1 : '') : is('mozilla/') ? g : '', is('j2me') ? 'mobile' : is('iphone') ? 'iphone' : is('ipod') ? 'ipod' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' : is('freebsd') ? 'freebsd' : (is('x11') || is('linux')) ? 'linux' : '', 'js'];

			c = b.join(' ');
			h.className += ' ' + c;

			var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;

			if(isIE11) {
				jQuery('html').removeClass('gecko').addClass('ie ie11');
				return;
			}

		}

	});
})(jQuery);

/** Appear
	https://github.com/bas2k/jquery.appear/
 **************************************************************** **/
(function(a){a.fn.appear=function(d,b){var c=a.extend({data:undefined,one:true,accX:0,accY:0},b);return this.each(function(){var g=a(this);g.appeared=false;if(!d){g.trigger("appear",c.data);return}var f=a(window);var e=function(){if(!g.is(":visible")){g.appeared=false;return}var r=f.scrollLeft();var q=f.scrollTop();var l=g.offset();var s=l.left;var p=l.top;var i=c.accX;var t=c.accY;var k=g.height();var j=f.height();var n=g.width();var m=f.width();if(p+k+t>=q&&p<=q+j+t&&s+n+i>=r&&s<=r+m+i){if(!g.appeared){g.trigger("appear",c.data)}}else{g.appeared=false}};var h=function(){g.appeared=true;if(c.one){f.unbind("scroll",e);var j=a.inArray(e,a.fn.appear.checks);if(j>=0){a.fn.appear.checks.splice(j,1)}}d.apply(this,arguments)};if(c.one){g.one("appear",c.data,h)}else{g.bind("appear",c.data,h)}f.scroll(e);a.fn.appear.checks.push(e);(e)()})};a.extend(a.fn.appear,{checks:[],timeout:null,checkAll:function(){var b=a.fn.appear.checks.length;if(b>0){while(b--){(a.fn.appear.checks[b])()}}},run:function(){if(a.fn.appear.timeout){clearTimeout(a.fn.appear.timeout)}a.fn.appear.timeout=setTimeout(a.fn.appear.checkAll,20)}});a.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(c,d){var b=a.fn[d];if(b){a.fn[d]=function(){var e=b.apply(this,arguments);a.fn.appear.run();return e}}})})(jQuery);

/** WOW - v1.0.3 - 2015-01-14
	http://mynameismatthieu.com/WOW/
 **************************************************************** **/
(function(){var a,b,c,d,e,f=function(a,b){return function(){return a.apply(b,arguments)}},g=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b=function(){function a(){}return a.prototype.extend=function(a,b){var c,d;for(c in b)d=b[c],null==a[c]&&(a[c]=d);return a},a.prototype.isMobile=function(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)},a.prototype.addEvent=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c},a.prototype.removeEvent=function(a,b,c){return null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]},a.prototype.innerHeight=function(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight},a}(),c=this.WeakMap||this.MozWeakMap||(c=function(){function a(){this.keys=[],this.values=[]}return a.prototype.get=function(a){var b,c,d,e,f;for(f=this.keys,b=d=0,e=f.length;e>d;b=++d)if(c=f[b],c===a)return this.values[b]},a.prototype.set=function(a,b){var c,d,e,f,g;for(g=this.keys,c=e=0,f=g.length;f>e;c=++e)if(d=g[c],d===a)return void(this.values[c]=b);return this.keys.push(a),this.values.push(b)},a}()),a=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(a=function(){function a(){"undefined"!=typeof console&&null!==console&&console.warn("MutationObserver is not supported by your browser."),"undefined"!=typeof console&&null!==console&&console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")}return a.notSupported=!0,a.prototype.observe=function(){},a}()),d=this.getComputedStyle||function(a){return this.getPropertyValue=function(b){var c;return"float"===b&&(b="styleFloat"),e.test(b)&&b.replace(e,function(a,b){return b.toUpperCase()}),(null!=(c=a.currentStyle)?c[b]:void 0)||null},this},e=/(\-([a-z]){1})/g,this.WOW=function(){function e(a){null==a&&(a={}),this.scrollCallback=f(this.scrollCallback,this),this.scrollHandler=f(this.scrollHandler,this),this.start=f(this.start,this),this.scrolled=!0,this.config=this.util().extend(a,this.defaults),this.animationNameCache=new c}return e.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null},e.prototype.init=function(){var a;return this.element=window.document.documentElement,"interactive"===(a=document.readyState)||"complete"===a?this.start():this.util().addEvent(document,"DOMContentLoaded",this.start),this.finished=[]},e.prototype.start=function(){var b,c,d,e;if(this.stopped=!1,this.boxes=function(){var a,c,d,e;for(d=this.element.querySelectorAll("."+this.config.boxClass),e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.all=function(){var a,c,d,e;for(d=this.boxes,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.boxes.length)if(this.disabled())this.resetStyle();else for(e=this.boxes,c=0,d=e.length;d>c;c++)b=e[c],this.applyStyle(b,!0);return this.disabled()||(this.util().addEvent(window,"scroll",this.scrollHandler),this.util().addEvent(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live?new a(function(a){return function(b){var c,d,e,f,g;for(g=[],e=0,f=b.length;f>e;e++)d=b[e],g.push(function(){var a,b,e,f;for(e=d.addedNodes||[],f=[],a=0,b=e.length;b>a;a++)c=e[a],f.push(this.doSync(c));return f}.call(a));return g}}(this)).observe(document.body,{childList:!0,subtree:!0}):void 0},e.prototype.stop=function(){return this.stopped=!0,this.util().removeEvent(window,"scroll",this.scrollHandler),this.util().removeEvent(window,"resize",this.scrollHandler),null!=this.interval?clearInterval(this.interval):void 0},e.prototype.sync=function(){return a.notSupported?this.doSync(this.element):void 0},e.prototype.doSync=function(a){var b,c,d,e,f;if(null==a&&(a=this.element),1===a.nodeType){for(a=a.parentNode||a,e=a.querySelectorAll("."+this.config.boxClass),f=[],c=0,d=e.length;d>c;c++)b=e[c],g.call(this.all,b)<0?(this.boxes.push(b),this.all.push(b),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(b,!0),f.push(this.scrolled=!0)):f.push(void 0);return f}},e.prototype.show=function(a){return this.applyStyle(a),a.className=""+a.className+" "+this.config.animateClass,null!=this.config.callback?this.config.callback(a):void 0},e.prototype.applyStyle=function(a,b){var c,d,e;return d=a.getAttribute("data-wow-duration"),c=a.getAttribute("data-wow-delay"),e=a.getAttribute("data-wow-iteration"),this.animate(function(f){return function(){return f.customStyle(a,b,d,c,e)}}(this))},e.prototype.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),e.prototype.resetStyle=function(){var a,b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.style.visibility="visible");return e},e.prototype.customStyle=function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a},e.prototype.vendors=["moz","webkit"],e.prototype.vendorSet=function(a,b){var c,d,e,f;f=[];for(c in b)d=b[c],a[""+c]=d,f.push(function(){var b,f,g,h;for(g=this.vendors,h=[],b=0,f=g.length;f>b;b++)e=g[b],h.push(a[""+e+c.charAt(0).toUpperCase()+c.substr(1)]=d);return h}.call(this));return f},e.prototype.vendorCSS=function(a,b){var c,e,f,g,h,i;for(e=d(a),c=e.getPropertyCSSValue(b),i=this.vendors,g=0,h=i.length;h>g;g++)f=i[g],c=c||e.getPropertyCSSValue("-"+f+"-"+b);return c},e.prototype.animationName=function(a){var b;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=d(a).getPropertyValue("animation-name")}return"none"===b?"":b},e.prototype.cacheAnimationName=function(a){return this.animationNameCache.set(a,this.animationName(a))},e.prototype.cachedAnimationName=function(a){return this.animationNameCache.get(a)},e.prototype.scrollHandler=function(){return this.scrolled=!0},e.prototype.scrollCallback=function(){var a;return!this.scrolled||(this.scrolled=!1,this.boxes=function(){var b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],a&&(this.isVisible(a)?this.show(a):e.push(a));return e}.call(this),this.boxes.length||this.config.live)?void 0:this.stop()},e.prototype.offsetTop=function(a){for(var b;void 0===a.offsetTop;)a=a.parentNode;for(b=a.offsetTop;a=a.offsetParent;)b+=a.offsetTop;return b},e.prototype.isVisible=function(a){var b,c,d,e,f;return c=a.getAttribute("data-wow-offset")||this.config.offset,f=window.pageYOffset,e=f+Math.min(this.element.clientHeight,this.util().innerHeight())-c,d=this.offsetTop(a),b=d+a.clientHeight,e>=d&&b>=f},e.prototype.util=function(){return null!=this._util?this._util:this._util=new b},e.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},e}()}).call(this);

/** jQuery Placeholder v0.2.4
	http://matoilic.github.com/jquery.placeholder
 **************************************************************** **/
(function(b,f,i){function l(){b(this).find(c).each(j)}function m(a){for(var a=a.attributes,b={},c=/^jQuery\d+/,e=0;e<a.length;e++)if(a[e].specified&&!c.test(a[e].name))b[a[e].name]=a[e].value;return b}function j(){var a=b(this),d;a.is(":password")||(a.data("password")?(d=a.next().show().focus(),b("label[for="+a.attr("id")+"]").attr("for",d.attr("id")),a.remove()):a.realVal()==a.attr("placeholder")&&(a.val(""),a.removeClass("placeholder")))}function k(){var a=b(this),d,c;placeholder=a.attr("placeholder");b.trim(a.val()).length>0||(a.is(":password")?(c=a.attr("id")+"-clone",d=b("<input/>").attr(b.extend(m(this),{type:"text",value:placeholder,"data-password":1,id:c})).addClass("placeholder"),a.before(d).hide(),b("label[for="+a.attr("id")+"]").attr("for",c)):(a.val(placeholder),a.addClass("placeholder")))}var g="placeholder"in f.createElement("input"),h="placeholder"in f.createElement("textarea"),c=":input[placeholder]";b.placeholder={input:g,textarea:h};!i&&g&&h?b.fn.placeholder=function(){}:(!i&&g&&!h&&(c="textarea[placeholder]"),b.fn.realVal=b.fn.val,b.fn.val=function(){var a=b(this),d;if(arguments.length>0)return a.realVal.apply(this,arguments);d=a.realVal();a=a.attr("placeholder");return d==a?"":d},b.fn.placeholder=function(){this.filter(c).each(k);return this},b(function(a){var b=a(f);b.on("submit","form",l);b.on("focus",c,j);b.on("blur",c,k);a(c).placeholder()}))})(jQuery,document,window.debug);

/** jQuery Easing v1.3
	http://gsgd.co.uk/sandbox/jquery/easing/
 **************************************************************** **/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

/**	Slimscroll 1.3.3
	https://github.com/rochal/jQuery-slimScroll/
 **************************************************************** **/
(function(e){e.fn.extend({slimScroll:function(g){var a=e.extend({width:"auto",height:"250px",size:"7px",color:"#000",position:"right",distance:"1px",start:"top",opacity:.4,alwaysVisible:!1,disableFadeOut:!1,railVisible:!1,railColor:"#333",railOpacity:.2,railDraggable:!0,railClass:"slimScrollRail",barClass:"slimScrollBar",wrapperClass:"slimScrollDiv",allowPageScroll:!1,wheelStep:20,touchScrollStep:200,borderRadius:"7px",railBorderRadius:"7px"},g);this.each(function(){function u(d){if(r){d=d||window.event;var c=0;d.wheelDelta&&(c=-d.wheelDelta/120);d.detail&&(c=d.detail/3);e(d.target||d.srcTarget||d.srcElement).closest("."+a.wrapperClass).is(b.parent())&&m(c,!0);d.preventDefault&&!k&&d.preventDefault();k||(d.returnValue=!1)}}function m(d,e,g){k=!1;var f=d,h=b.outerHeight()-c.outerHeight();e&&(f=parseInt(c.css("top"))+d*parseInt(a.wheelStep)/100*c.outerHeight(),f=Math.min(Math.max(f,0),h),f=0<d?Math.ceil(f):Math.floor(f),c.css({top:f+"px"}));l=parseInt(c.css("top"))/(b.outerHeight()-c.outerHeight());f=l*(b[0].scrollHeight-b.outerHeight());g&&(f=d,d=f/b[0].scrollHeight*b.outerHeight(),d=Math.min(Math.max(d,0),h),c.css({top:d+"px"}));b.scrollTop(f);b.trigger("slimscrolling",~~f);v();p()}function C(){window.addEventListener?(this.addEventListener("DOMMouseScroll",u,!1),this.addEventListener("mousewheel",u,!1)):document.attachEvent("onmousewheel",u)}function w(){s=Math.max(b.outerHeight()/b[0].scrollHeight*b.outerHeight(),30);c.css({height:s+"px"});var a=s==b.outerHeight()?"none":"block";c.css({display:a})}function v(){w();clearTimeout(A);l==~~l?(k=a.allowPageScroll,B!=l&&b.trigger("slimscroll",0==~~l?"top":"bottom")):k=!1;B=l;s>=b.outerHeight()?k=!0:(c.stop(!0,!0).fadeIn("fast"),a.railVisible&&h.stop(!0,!0).fadeIn("fast"))}function p(){a.alwaysVisible||(A=setTimeout(function(){a.disableFadeOut&&r||x||y||(c.fadeOut("slow"),h.fadeOut("slow"))},1E3))}var r,x,y,A,z,s,l,B,k=!1,b=e(this);if(b.parent().hasClass(a.wrapperClass)){var n=b.scrollTop(),c=b.parent().find("."+a.barClass),h=b.parent().find("."+a.railClass);w();if(e.isPlainObject(g)){if("height"in g&&"auto"==g.height){b.parent().css("height","auto");b.css("height","auto");var q=b.parent().parent().height();b.parent().css("height",q);b.css("height",q)}if("scrollTo"in g)n=parseInt(a.scrollTo);else if("scrollBy"in g)n+=parseInt(a.scrollBy);else if("destroy"in g){c.remove();h.remove();b.unwrap();return}m(n,!1,!0)}}else if(!(e.isPlainObject(g)&&"destroy"in g)){a.height="auto"==a.height?b.parent().height():a.height;n=e("<div></div>").addClass(a.wrapperClass).css({position:"relative",overflow:"hidden",width:a.width,height:a.height});b.css({overflow:"hidden",width:a.width,height:a.height});var h=e("<div></div>").addClass(a.railClass).css({width:a.size,height:"100%",position:"absolute",top:0,display:a.alwaysVisible&&a.railVisible?"block":"none","border-radius":a.railBorderRadius,background:a.railColor,opacity:a.railOpacity,zIndex:90}),c=e("<div></div>").addClass(a.barClass).css({background:a.color,width:a.size,position:"absolute",top:0,opacity:a.opacity,display:a.alwaysVisible?"block":"none","border-radius":a.borderRadius,BorderRadius:a.borderRadius,MozBorderRadius:a.borderRadius,WebkitBorderRadius:a.borderRadius,zIndex:99}),q="right"==a.position?{right:a.distance}:{left:a.distance};h.css(q);c.css(q);b.wrap(n);b.parent().append(c);b.parent().append(h);a.railDraggable&&c.bind("mousedown",function(a){var b=e(document);y=!0;t=parseFloat(c.css("top"));pageY=a.pageY;b.bind("mousemove.slimscroll",function(a){currTop=t+a.pageY-pageY;c.css("top",currTop);m(0,c.position().top,!1)});b.bind("mouseup.slimscroll",function(a){y=!1;p();b.unbind(".slimscroll")});return!1}).bind("selectstart.slimscroll",function(a){a.stopPropagation();a.preventDefault();return!1});h.hover(function(){v()},function(){p()});c.hover(function(){x=!0},function(){x=!1});b.hover(function(){r=!0;v();p()},function(){r=!1;p()});b.bind("touchstart",function(a,b){a.originalEvent.touches.length&&(z=a.originalEvent.touches[0].pageY)});b.bind("touchmove",function(b){k||b.originalEvent.preventDefault();b.originalEvent.touches.length&&(m((z-b.originalEvent.touches[0].pageY)/a.touchScrollStep,!0),z=b.originalEvent.touches[0].pageY)});w();"bottom"===a.start?(c.css({top:b.outerHeight()-c.outerHeight()}),m(0,!0)):"top"!==a.start&&(m(e(a.start).position().top,null,!0),a.alwaysVisible||c.hide());C()}});return this}});e.fn.extend({slimscroll:e.fn.slimScroll})})(jQuery);
