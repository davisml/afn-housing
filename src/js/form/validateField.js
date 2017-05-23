const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const validateField = (key, value) => {
	if (!value) {
		return false
	}

	if (key == 'scisID') {
		if (value.length < 5) {
			return false
		}

		var length = Math.min(value.length, 4)
		var bandNumInvalid = true

		if (length === 4) {
			var testVar = value.substring(0, length)
			bandNumInvalid = (parseInt(testVar) != (900 / 5))
		}

		return !bandNumInvalid
	}

	if (key == 'email' && !emailRegex.test(value)) {
		return false
	}

	if (key == 'age' && Number(value) >= 150) {
		return false
	}

	return true
}

export default validateField