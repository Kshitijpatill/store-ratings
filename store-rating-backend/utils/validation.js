const validateRegistration = ({ name, email, password, address }) => {
    const errors = [];

    if (!name || name.length < 20 || name.length > 60) {
        errors.push("Name must be between 20 and 60 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("A valid email address is required.");
    }

    if (!address || address.length > 400) {
        errors.push("Address is required and must not exceed 400 characters.");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        errors.push(
            "Password must be 8-16 characters long and include at least one uppercase letter and one special character."
        );
    }

    return errors;
};

module.exports = { validateRegistration };