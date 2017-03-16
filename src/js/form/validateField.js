const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const validateField = (key, value) => {
	if (!value) {
		return false
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