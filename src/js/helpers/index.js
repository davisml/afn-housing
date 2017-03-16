const getURLParams = (url) => {
	const searchSplit = url.slice(1).split('&').map((string) => string.split('='))
	const searchParams = {}

	searchSplit.forEach(([key, value]) => {
		searchParams[key] = value
	})

	return searchParams
}

export { getURLParams }