module.exports = function(email) {
    return {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'You have been registered successfully',
        html: `
            <h1>Welcome to our store</h1>
            <p>You have been successfully registered with email - ${email}</p>
            <hr />
            <a href="${process.env.BASE_URL}/auth/login">Courses store</a>
        `
    };
}