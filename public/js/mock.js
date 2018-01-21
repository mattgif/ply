const MOCK_SPACE_LOCATIONS = {
	"locations": [
		{
			"id": "111111",
			"spaceID":"g11111120002",
			"title": "Dirt Church DC",
			"type": "Partial Garage",
			"owner": "dirtchurch",
			"location": {			  
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
					-76.98308860883117,
					38.892101707724315
					]
				},
			      "properties": {
			      	"name": "Dirt Church DC"
			      }				  
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
			"type": "Shop with workspace",
			"owner": "dunnlewis",
			"location": {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-76.98477645171806,
						38.914990067304565
					]
				},
				"properties": {
					"name": "Dunn Lewis MC"
				}
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
			"location":     {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
					-77.01188396662474,
					38.90963574367117
					]
				},
				"properties": {
					"name": "Half of underground garage"
				}
			},
			"coverImage": "testgarage.jpg",
			"availability": {
				2018: {
					1: [1]
				}
			}
		}
	]
}

