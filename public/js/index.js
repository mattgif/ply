// nav
function menuTriggerListener() {
	$('.bt-menu-trigger').click(() => {
		$('.bt-menu-trigger').toggleClass('bt-menu-open');
		$('.mobile__menu').toggleClass('open');
		if ($('button.logo.splash').length) {
			if ($('.mobile__menu').hasClass('open')) {
				$('button.logo.splash').fadeIn(1200);			
			} else {
				$('button.logo.splash').fadeOut()
			}
		}
	})	
}

function navButtonListeners() {
	menuTriggerListener();
	logoClickListener();
}

function logoClickListener() {
	$('button.logo').click(() => {
		window.location.href = '/';
	})
}

// maps autocomplete
let autocomplete;
function initAutocomplete() {
	// sets search bar as maps autocomplete element; callback from script on pageload
	const input = document.getElementById('pac-input');
	autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});	
}

function getAddressFromAutoComplete() {
	// returns the google place object selected by the user
	return autocomplete.getPlace();
}

function searchListener() {
	$('.search__button').click(e => {
		e.preventDefault();
		let place = getAddressFromAutoComplete();		
		if (place && place.geometry) {
			// check for valid location, then populate and submit
			$('#lat-input').val(place.geometry.location.lat());
			$('#lng-input').val(place.geometry.location.lng());
			$('.search__form').submit();
		} else {
			// need warning 
		}
	})
}

// modals 
function modalJoinClick() {
	// displays join modal on click
	$('.join').click(e => {
		e.preventDefault();
		modalOpen('.modal__join','#signup-email');
	})
}

function modalLoginClick() {
	$('.login').click(e => {
		e.preventDefault();
		modalOpen('.modal__login', '#login-email');
	})
}

function modalOpen(modalDialog,focusTarget) {
	if ($('.modal__dialog').is(":visible")) {
		$('.modal__dialog').hide();
		$(modalDialog).show();
	} else {
		$('.js-modal-wrapper').css('top', 0);
		$('.modal__overlay').fadeIn(400);		
		$(modalDialog).slideDown(100);	
	}
	$(focusTarget).focus();
	modalCloseListeners();		
	modalKeepTabFocus();
}

function modalClose() {
	$('.modal__overlay, .modal__dialog').fadeOut(200);
	setTimeout(function() {
		$('.js-modal-wrapper').css('top', '-100%')
	},200);
	// clear modal fields
	$('.modal__dialog input').val('');
	// turn off listeners used to keep focus in modal
	$('.join, .login').off("keydown");
	$('.js-modal-wrapper, .js-modal-dialog').off("click");
	$('.js-modal-close').off("click")
}

function modalCloseClick() {
	$('.js-modal-close').click(e => {
		e.preventDefault;
		modalClose();
	})
}

function modalEscapePress() {
	$('body').keydown(e => {
			// hide modal on escape press
			if (e.keyCode==27){
				modalClose();
			}			
		})
}

function modalOutsideClick() {
	$('.js-modal-dialog').click(e => {
		e.stopPropagation();		
	})
	$('.js-modal-wrapper').click(() => {
		modalClose();
	})
}

function modalKeepTabFocus() {
	// prevents tab from leaving modal by going back to top focusable element in dialog 
	// after last is reached
	$('.join, .login').keydown(e => {
		if (e.keyCode === 9) {
			e.preventDefault();				
			$('.js-modal-close').focus();
		}
	})	
}

function modalCloseListeners() {
	modalCloseClick();
	modalEscapePress();
	modalOutsideClick();
}

function modalOpenListeners() {
	modalJoinClick();
	modalLoginClick();
}

// core
function pageHandler() {	
	modalOpenListeners();
	navButtonListeners();
	searchListener();
}

$(pageHandler);