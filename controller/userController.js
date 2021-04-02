/**
* Controller holds the logic for all user routes
* including Show, create, Update, Delete user
 */

const User = require('../models/user');



// renders the login page
module.exports.viewLogin = (req, res) => {
    res.render('users/login')
}

// renders the registration page
module.exports.viewRegister = (req, res) => {
    res.render('users/register')
}

/**
 * holds the logic for successful login
 * the save link inside @req.session.returnTo is the last link user access
 * before user get redirect to login
 * if user request the page on his/her own then the redirect will be /campgrounds
 * then user will be returned to @redirectURL and delete the returnTo variable  
 */
module.exports.login = (req, res) => {
    req.flash('success', "Welcome Back!");
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}

/**
 * holds the logic for creating new user
 * extract @email @username @password from req.body
 * create new user using passport function called register 
 * with params user that was created and password
 * then login this user to session and redirect to error if any
 * if any error occur redirect to registeration page with error
 */
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to Yelp Camp");
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('register');
    }
}

// holds logic for logout user from app
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
}

