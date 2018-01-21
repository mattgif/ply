const MOCK_SPACE_LOCATIONS = {
	"locations": [
		{
			"id": "111111",
			"spaceID":"g11111120002",
			"title": "Dirt Church DC",
			"type": "Partial Garage",
			"owner": "dirtchurch",
			"location": {			  
				"type": "Point",
				"coordinates": [
					-76.98308860883117,
					38.892101707724315
				]			  
			},
			"coverImage" : "dirtchurch1.jpg",
			"availability": {								
				2018: {
					1: {
						29: [17,18,19,20,21,22,23],
						30: [9, 10, 11, 14, 15, 16],
					},
					2: {
						1: [9, 10, 11, 12, 13, 14, 15, 16],
						2: [9, 10, 11, 12, 13, 14, 15, 16],
						3: [9, 10, 11, 12, 13, 14, 15, 16],
					}
				}
			}			
		},		
		{
			"id": "222222",
			"spaceID":"s22222220002",
			"title": "Dunn Lewis MC",
			"type": "Workspace",
			"owner": "dunnlewis",
			"location": {
				"type": "Point",
				"coordinates": [
					-76.98477645171806,
					38.914990067304565
				]
			},
			"coverImage" : "dunnlewis.jpg",
			"availability": {
				2018: {
					1: {
						29: [14, 15, 16, 17, 18],
						30: [9, 10, 11, 14, 15, 16],
					},
					2: {
						1: [9, 10, 11, 12, 13, 14, 15, 16],
						2: [9, 10, 11, 12, 13, 14, 15, 16],
						3: [9, 10, 11, 12, 13, 14, 15, 16],
					}
				}
			}			
		},
		{
			"id": "333333",
			"spaceID":"g33333320002",
			"title": "Half of underground garage",
			"type": "Partial Garage",
			"owner": "testuser123",
			"location": {
				"type": "Point",
				"coordinates": [
					-77.01188396662474,
					38.90963574367117
				]
			},
			"coverImage": "testgarage.jpg",
			"availability": {
				2018: {
					1: [1]
				}
			}
		},
		{
			"id": "357223",
			"spaceID": "w35722320002",
			"title": "Corporis beatae aperiam distinctio.",
			"type": "Shed",
			"owner": "porpoisehat",
			"location": {
				"type": "Point",
				"coordinates": "[-77.06974249501943, 38.96433931880528]",
			},
			"coverImage": "test1.jpg",
			"availability": {}
		},
		{
			"id": "163717",
			"spaceID": "p16371720002",
			"title": "Id ipsam reprehenderit eligendi atque.",
			"type": "Storage Facility",
			"owner": "porpoisehat",
			"location": {
				"type": "Point",
				"coordinates": "[-77.01874447101464, 38.9288074098219]",
			},
			"coverImage": "test2.jpg",
			"availability": {}
		},
		{
			"id": "502795",
			"spaceID": "f50279520002",
			"title": "Inventore quo voluptatibus atque officiis illo iste esse.",
			"type": "Partial Garage",
			"owner": "tylerthompson",
			"location": {
				"type": "Point",
				"coordinates": "[-77.08323965310505, 38.94610382604133]",
			},
			"coverImage": "test3.jpg",
			"availability": {}
		},
		{
			"id": "477519",
			"spaceID": "f47751920002",
			"title": "Fugiat laboriosam consequatur eaque magnam.",
			"type": "Workspace",
			"owner": "wrighttina",
			"location": {
				"type": "Point",
				"coordinates": "[-77.00240664714067, 38.832873993415646]",
			},
			"coverImage": "test4.jpg",
			"availability": {}
		},
		{
			"id": "183341",
			"spaceID": "w18334120002",
			"title": "Aperiam iste nobis dicta nam.",
			"type": "Workspace",
			"owner": "oadams",
			"location": {
				"type": "Point",
				"coordinates": "[-77.00127714673889, 38.89274185598619]",
			},
			"coverImage": "test5.jpg",
			"availability": {}
		},
		{
			"id": "610987",
			"spaceID": "f61098720002",
			"title": "Blanditiis non distinctio ex rerum amet.",
			"type": "Shed",
			"owner": "kmiller",
			"location": {
				"type": "Point",
				"coordinates": "[-76.99764671520994, 38.85045629048532]",
			},
			"coverImage": "test6.jpg",
			"availability": {}
		},
		{
			"id": "156367",
			"spaceID": "w15636720002",
			"title": "Quibusdam placeat rem nihil labore.",
			"type": "Whole Garage",
			"owner": "carlos41",
			"location": {
				"type": "Point",
				"coordinates": "[-77.02413668420034, 38.991175537936414]",
			},
			"coverImage": "test7.jpg",
			"availability": {}
		},
		{
			"id": "395479",
			"spaceID": "g39547920002",
			"title": "Suscipit fuga voluptatum porro praesentium distinctio fuga.",
			"type": "Shop",
			"owner": "grossangela",
			"location": {
				"type": "Point",
				"coordinates": "[-77.06800639488955, 38.844720751787705]",
			},
			"coverImage": "test8.jpg",
			"availability": {}
		},
		{
			"id": "149556",
			"spaceID": "d14955620002",
			"title": "Vel repellendus quo non error sequi consectetur optio numquam.",
			"type": "Shop",
			"owner": "rachelmeyer",
			"location": {
				"type": "Point",
				"coordinates": "[-77.07312517383083, 38.8477155139401]",
			},
			"coverImage": "test9.jpg",
			"availability": {}
		},
		{
			"id": "282107",
			"spaceID": "d28210720002",
			"title": "Est nobis laboriosam eaque occaecati ipsum.",
			"type": "Whole Garage",
			"owner": "bobdickson",
			"location": {
				"type": "Point",
				"coordinates": "[-76.96172737018063, 38.90664965185846]",
			},
			"coverImage": "test10.jpg",
			"availability": {}
		},
		{
			"id": "336512",
			"spaceID": "d33651220002",
			"title": "At nobis reiciendis placeat nisi.",
			"type": "Whole Garage",
			"owner": "cassandra70",
			"location": {
				"type": "Point",
				"coordinates": "[-76.98888401884913, 38.91575685442303]",
			},
			"coverImage": "test11.jpg",
			"availability": {}
		},
		{
			"id": "706573",
			"spaceID": "d70657320002",
			"title": "Dolor odit ducimus distinctio numquam nesciunt sit labore.",
			"type": "Shop",
			"owner": "drivers",
			"location": {
				"type": "Point",
				"coordinates": "[-77.10385788589858, 38.92821611571357]",
			},
			"coverImage": "test12.jpg",
			"availability": {}
		},
		{
			"id": "461211",
			"spaceID": "g46121120002",
			"title": "Magnam dolore quasi rerum excepturi aliquid vel.",
			"type": "Partial Garage",
			"owner": "christophersingh",
			"location": {
				"type": "Point",
				"coordinates": "[-76.99020081199743, 38.83081769358231]",
			},
			"coverImage": "test13.jpg",
			"availability": {}
		},
		{
			"id": "343239",
			"spaceID": "g34323920002",
			"title": "Modi officiis ratione autem perferendis velit nihil nulla ad.",
			"type": "Workspace",
			"owner": "emilyreyes",
			"location": {
				"type": "Point",
				"coordinates": "[-76.95542143848908, 38.921660343460175]",
			},
			"coverImage": "test14.jpg",
			"availability": {}
		},
		{
			"id": "775536",
			"spaceID": "w77553620002",
			"title": "Repudiandae corporis non accusamus.",
			"type": "Partial Garage",
			"owner": "howardkevin",
			"location": {
				"type": "Point",
				"coordinates": "[-77.02106313181972, 38.82537138426705]",
			},
			"coverImage": "test15.jpg",
			"availability": {}
		},
		{
			"id": "730160",
			"spaceID": "g73016020002",
			"title": "Blanditiis eligendi quia beatae laborum veniam possimus sit laborum.",
			"type": "Shop",
			"owner": "mhodge",
			"location": {
				"type": "Point",
				"coordinates": "[-77.06785961066421, 38.89969843213124]",
			},
			"coverImage": "test16.jpg",
			"availability": {}
		},
		{
			"id": "465523",
			"spaceID": "d46552320002",
			"title": "Eos repudiandae sunt unde eius in.",
			"type": "Storage Facility",
			"owner": "keith85",
			"location": {
				"type": "Point",
				"coordinates": "[-77.06666621413838, 38.96101604940564]",
			},
			"coverImage": "test17.jpg",
			"availability": {}
		},
		{
			"id": "555188",
			"spaceID": "f55518820002",
			"title": "Reprehenderit distinctio eius itaque praesentium deserunt aliquam rem.",
			"type": "Storage Facility",
			"owner": "jcameron",
			"location": {
				"type": "Point",
				"coordinates": "[-77.05075181814867, 38.84071208761671]",
			},
			"coverImage": "test18.jpg",
			"availability": {}
		},
	]
}

function getSpacesFromApi(address, callback) {
	callback(MOCK_SPACE_LOCATIONS);
}

function displayResults(JSONdata) {
	const results = JSONdata.locations.map(loc => renderResults(loc));
	$('.results').html(results)
}

function renderResults(loc) {
	const image = "/userdata/" + loc.owner + "/" + loc.spaceID + "/" + loc.coverImage;
	return `
		<div class="result__card">
			<div class="result__card__top" style="background-image:url('${image}')">				
			</div>
			<div class="result__card__bot">
				<h4 class="result__card__type">${loc.type}</h4>
				<h3 class="result__card__title">${loc.title}</h3>
			</div>
		</div>
	`
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


function requestNearbyResults() {
	let center = getAddressFromWindow()
	getSpacesFromApi(center,displayResults)
}

$(requestNearbyResults)

//var url_string = "http://www.example.com/t.html?a=1&b=3&c=m2-m3-m4-m5"; //window.location.href var url = new URL(url_string); var c = url.searchParams.get("c");