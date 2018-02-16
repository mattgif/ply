// GETRESULTS.JS
function cardClickListener() {
	$('.results').on('click','.result__card', e => {
		let target = e.target.closest('.result__card');
		window.location.href = `/spaces/${target.id}`
	});
}

function displayResults(JSONdata) {
    if (JSONdata.length < 1) {
        const searchTerm = $('#pac-input').val();
        $('.results').html(`
            <h2 style="color: #333;">Sorry, there are no spaces available in ${searchTerm}... yet. Stay tuned!</h2>
        `)
    } else {
        const results = JSONdata.map(loc => renderResults(loc));
        $('.results').html(results);
    }

}

function requestURLParams() {
	const url = new URL(window.location.href);
	let query;
	if (url.searchParams.get("address")) {
		$('.search__bar').val(url.searchParams.get("address"));
		query = {
			"location": { 				
				"coordinates" : [url.searchParams.get("lng"), url.searchParams.get("lat")]
			}
		}
	} else {
		const path = url.pathname.split('/');
		query = {
			"username": path[path.length -1]
		}
	}
	getSpacesFromApi(query,displayResults)
}

function getSpacesFromApi(query, callback) {	
	// takes in the criteria by which to filter (address or user)	
	$.ajax({
		type: 'POST',
		url: '/api/find_spaces',
		data: query,
		success: callback 
	})
}

function renderResults(space) {
	const loc = space.space;
	const image = loc.coverImage;
	let editButton;
	if (space.isOwner) {
		editButton = `
			<div class="edit__button">
				<a href="/spaces/${loc.spaceID}/edit" class="edit__link"><i class="material-icons">mode_edit</i></a>
			</div>
		`;
	} else {
		editButton = '';
	}
		
	return `
		<div class="result__card" id="${loc.spaceID}">
			<div class="result__card__top" style="background-image:url('${image}')">				
			</div>
			${editButton}
			<div class="result__card__bot">
				<h4 class="result__card__type">${loc.type}</h4>
				<h3 class="result__card__title">${loc.title}</h3>
			</div>
		</div>
	`
}

function eventListeners() {
	cardClickListener();
}

function pageHandler() {	
	requestURLParams();
	eventListeners();
}

$(pageHandler);
