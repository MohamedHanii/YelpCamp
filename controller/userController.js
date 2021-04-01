const User = require('../models/user');


module.exports.viewLogin = (req, res) => {
    res.render('users/login')
}

module.exports.viewRegister = (req, res) => {
    res.render('users/register')
}

module.exports.login = (req, res) => {
    req.flash('success', "Welcome Back!");
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}
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

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye");
    res.redirect("/campgrounds");
}

