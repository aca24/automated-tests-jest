exports.getBodyRequest = (name, email, password) => {

    var bodyRequest = {
        "name": name,
		"email": email,
		"password": password
    }

    return bodyRequest;
}