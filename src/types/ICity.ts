interface Coordinates {
	lat: number
	lon: number
}

interface Region {
	name: string
	type: string
	fullname: string
	name_en: string
}

export interface ICity extends Document {
	_id: string
	name: string
	type: string
	name_en: string
	coords: Coordinates
	region: Region
	population: number
}
