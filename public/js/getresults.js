// GETRESULTS.JS
function cardClickListener() {
	$('.results').on('click','.result__card', e => {
		let target = e.target.closest('.result__card');
		window.location.href = `/spaces/${target.id}`
	})
}

function displayResults(JSONdata) {	
	const results = JSONdata.map(loc => renderResults(loc));
	$('.results').html(results)
}

function getAddressFromWindow() {
	const url = new URL(window.location.href);
	$('.search__bar').val(url.searchParams.get("address"))
	return {
		"location": { 
			"type": "Point",
			"coordinates" : [url.searchParams.get("lng"), url.searchParams.get("lat")]
		}
	}	
}

function getSpacesFromApi(address, callback) {	
	$.getJSON('/api/find_spaces', address, callback);	
}

function renderResults(loc) {
	const image = "/userdata/" + loc.owner + "/" + loc.spaceID + "/" + loc.coverImage;
	return `
		<div class="result__card" id="${loc.spaceID}">
			<div class="result__card__top" style="background-image:url('${image}')">				
			</div>
			<div class="result__card__bot">
				<h4 class="result__card__type">${loc.type}</h4>
				<h3 class="result__card__title">${loc.title}</h3>
			</div>
		</div>
	`
}

function requestNearbyResults() {
	console.log('requestNearbyResults called')
	let center = getAddressFromWindow()
	getSpacesFromApi(center,displayResults)
}

function eventListeners() {
	cardClickListener();
}

function pageHandler() {	
	requestNearbyResults();
	eventListeners();
}

$(pageHandler)
