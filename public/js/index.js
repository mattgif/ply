// image upload
function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    let tmppath = URL.createObjectURL(event.target.files[0]);

    reader.onload = function (e) {
      $('#img-uploaded').attr('src', e.target.result);      
      $('.img__wrapper').show();
    }
    reader.readAsDataURL(input.files[0]);
  }
}

const imageUploadListener = function() {
    $("#photos").change(function(){     
        readURL(this);
    }); 
}

// login/out
function loginListener() {
    $('.login__form').submit(e => {
        e.preventDefault();
        const form = $('.login__form')
        const formData = $(form).serialize();       
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData,
            success: function() {
                $('#login-password').val('');
                modalClose();
                location.reload();
            },
            error: function() {
                $('#login-password').val('');
                $('.login__error').html('Incorrect username or password');
                $('.login__error').show();
                $('.modal__login').effect("shake");     
            }
        })
    })
}

function logoutListener() {
    $('.logout').click(() => {
        $.ajax({
            type: 'POST',
            url: '/api/logout',
            success: function(data) {                     
                window.location.href = '/';
            },
        })  
    })  
}

// CRUD
function disableSubmitOnEnter() {
    // users may hit 'enter' to confirm address in search box on space creation
    // this prevents enter from submitting the form, causing unwanted behavior
    if ($('section.create.space').length) {     
        // only listens created if space creation active
        $('.js-create-address').keypress(e => {
            if (e.which === 13) {
                $('form').submit(false);
            }
        })
    }
}

function createSpaceListener() {
    $('button.js-create').click(e => {
        e.preventDefault();
        const formData = new FormData($('#space-create-form'))
        $.ajax({
            type: "POST",
            url: '/api/spaces',
            data: FormData,
            success: (data) => {
                const spaceID = data._id;
                window.location.href = '/spaces/' + spaceID;
            }
        })
    })
}

function updateSpaceListener() {
    $('button.confirm__action.update.space.edit').click(() => {
        const spaceID = $("input[name='spaceID']").val();
        $.ajax({
            type: "PUT",
            url: $('#update__form').attr('action'),
            data: $('#update__form').serialize(),
            success: function() {
                window.location.href = '/spaces/' + spaceID;
            }
        })
        ('#update__form').submit()
    })  
}

function discardUpdateListener() {
    $('button.confirm__action.discard.space.edit').click(() => {
        const spaceID = $("input[name='spaceID']").val();
        window.location.href = '/spaces/' + spaceID;
    })  
}

function deleteSpaceListener() {
    $('button.confirm__action.delete.space.edit').click(() => {
        const spaceID = $("input[name='spaceID']").val();
        const owner = $("input[name='owner']").val();
        $.ajax({
            type: 'DELETE',
            url: '/api/spaces/' + spaceID,
            data: {
                spaceID: spaceID,
                owner: owner
            },
            success: () => {
                window.location.href = '/user/' + owner;
            },
        })
    })      
}

function spaceUpdateListeners() {
    updateSpaceListener();
    discardUpdateListener();
    deleteSpaceListener()
}

// nav
function logoClickListener() {
    // go to home page if navbar logo is clicked    
    $('button.logo').click(() => {
        if ($('.container__about').length) {
            $('.container__main').fadeIn(1200);
            $('button.nav__link.share').fadeIn(1200);
            $('.container__about').hide();
            $('button.logo.splash').hide();
        } else {
            window.location.href = '/';    
        }        
    })
}

function menuTriggerListener() {
    // listens for burger menu click and changes button styling,
    // show menu
    $('.bt-menu-trigger').click(() => {
        $('.bt-menu-trigger').toggleClass('bt-menu-open');
        $('.mobile__menu').toggleClass('open');
        if ($('.topmatter').length) {
            if ($('.mobile__menu').hasClass('open')) {
                $('.topmatter').css('position','fixed')
            } else {
                $('.topmatter').css('position','absolute')
            }
        }       
        if ($('button.logo.splash').length) {
            if ($('.mobile__menu').hasClass('open')) {
                $('button.logo.splash').fadeIn(1200);           
            } else {
                $('button.logo.splash').fadeOut()
            }
        }
    })  
}

function aboutListener() {
    // behavior for 'share a space' button on navbar
    $('button.share').click(() => {
        if (!($('.splash__background').length)) {
            window.location.href = '/'
        }
        $('.container__main').hide();
        $('button.nav__link.share').fadeOut(1200);
        $('.container__about').fadeIn(1200);
        $('button.logo.splash').fadeIn(1200);
    })
}

function createSpaceListener() {
    // behavior for 'create space' button on navbar
    $('button.create_space').click(() => {
        window.location.href = '/spaces/create';
    })
}

function navButtonListeners() {
    menuTriggerListener();
    logoClickListener();
    aboutListener();
    createSpaceListener();
}

// maps autocomplete
let autocomplete;
function initAutocomplete() {
    // sets search bar as maps autocomplete element; callback from script on pageload
    const input = document.getElementById('pac-input');
    autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});

    if ($('section.create.space').length) {
        // listener for filling in address form
        autocomplete.addListener('place_changed', fillInAddress);   
    }
}

const placesComponents = {
    // used to autocomplete addresses in form
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',  
    postal_code: 'short_name'
};

const placesValues = {
}

const formComponents = {
    street: function(){return placesValues.street_number + ' ' + placesValues.route},
    city: function(){return placesValues.locality},
    state: function(){return placesValues.administrative_area_level_1},
    zip: function(){return placesValues.postal_code},
}

function searchListener() {
    $('.search__button').click(e => {
        e.preventDefault();
        let place = autocomplete.getPlace();        
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

function fillInAddress() {
    // get place details from the autocomplete object
    const place = autocomplete.getPlace();

    for (let component in formComponents) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }
    if (place.address_components.length) {
        for (let i = 0; i < place.address_components.length; i++) {
        // read values off places object and store in obj       
        let addressType = place.address_components[i].types[0];
        if (placesComponents[addressType]) {
            let val = place.address_components[i][placesComponents[addressType]];
            placesValues[addressType] = val;
        }
    }
        for (let component in formComponents) {
            document.getElementById(component).value = formComponents[component]()
        }
        $('#lat-input').val(place.geometry.location.lat());
        $('#lng-input').val(place.geometry.location.lng()); 
    }
}

function geolocate() {
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        let circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
        });
    }
}

// modals
function cancelListener() {
    $('.js-cancel').click(e => {
        e.preventDefault();
        modalOpen('.modal__cancel','button.cancel__action')
    })
}

function updateListener() {
    $('.js-update').click(() => {       
        modalOpen('.modal__update','button.cancel__action')
    })
}

function deleteListener() {
    $('.js-delete').click(() => {       
        modalOpen('.modal__delete','button.cancel__action')
    })
}

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
        $('.modal__overlay, .confirm__dialog__overlay').fadeIn(400);        
        $(modalDialog).slideDown(100);  
    }
    $('.bt-menu-trigger').removeClass('bt-menu-open');
    $('.mobile__menu').removeClass('open');
    // close mobile menu
    $(focusTarget).focus();
    modalCloseListeners();      
    modalKeepTabFocus();
}

function modalClose() {
    $('.modal__overlay, .modal__dialog, .confirm__dialog__overlay').fadeOut(200);
    setTimeout(function() {
        $('.js-modal-wrapper').css('top', '-100%')
    },200);
    // clear modal fields
    $('.modal__dialog input').val('');
    $('.login__error').hide();
    // turn off listeners used to keep focus in modal
    $('.join, .login').off("keydown");
    $('.js-modal-wrapper, .js-modal-dialog').off("click");
    $('.js-modal-close').off("click")
}

function modalCloseClick() {
    $('.js-modal-close, button.cancel__action').click(e => {
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

    $('.confirm__action').keydown(e => {
        if (e.keyCode === 9) {
            e.preventDefault();
            $('.cancel__action').focus();
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
    cancelListener();
    updateListener();
    deleteListener();
}

// core
function pageHandler() {    
    logoutListener();
    loginListener();
    modalOpenListeners();
    navButtonListeners();   
    searchListener();   
    disableSubmitOnEnter();
    imageUploadListener();
}

$(pageHandler);