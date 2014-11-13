"use strict"

var Router = require("koa-router");
var session = require("koa-session");
var passport = require("./auth");

var koa = require("koa");
var app = koa();

app.keys = ["?A6Kc!RBWAtWBMBP7QYn&JNV0O"];
app.use(session());

// Middleware: request logger
function *reqLogger(next) {
    console.log("%s - %s '%s'",  new Date().toISOString(), this.req.method, this.req.url);
    yield next;
}
app.use(reqLogger);

// Initialize passport
app.use(passport.initialize());

var publicRouter = new Router();

// Configure /auth/github and /auth/github/callback
publicRouter.get("/auth/github", passport.authenticate("github", {scope: ["user", "repo"]}));
publicRouter.get("/auth/github/callback", passport.authenticate("github", {successRedirect: "/success", failureRedirect: "/"}));

publicRouter.get("/auth/facebook", passport.authenticate("facebook"));
publicRouter.get("/auth/facebook/callback", passport.authenticate("facebook", {successRedirect: "/success", failureRedirect: "/login"}));

publicRouter.get("/auth/google", passport.authenticate("google"));
publicRouter.get("/auth/google/callback", passport.authenticate("google", {successRedirect: "/success", failureRedirect: "/login"}));

publicRouter.get("/auth/twitter", passport.authenticate("twitter"));
publicRouter.get("/auth/twitter/callback", passport.authenticate("twitter", {successRedirect: "/success", failureRedirect: "/login"}));

app.use(publicRouter.middleware());

// Secure routes
var securedRouter = new Router();

// Middleware: authed for GitHub
function *authedGithub(next) {
    if (this.req.isAuthenticated()) yield next;
    else this.redirect("/auth/github");
}

// Middleware: authed for Facebook
function *authedFacebook(next) {
    if (this.req.isAuthenticated()) yield next;
    else this.redirect("/auth/facebook");
}

//Middleware: authed for Google
function *authedGoogle(next) {
    if (this.req.isAuthenticated()) yield next;
    else this.redirect("/auth/google");
}

function *authedTwitter(next) {
    if (this.req.isAuthenticated()) yield next;
    else this.redirect("/auth/twitter");
}

securedRouter.get("/github", authedGithub, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

securedRouter.get("/facebook", authedFacebook, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

securedRouter.get("/google", authedGoogle, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

securedRouter.get("/twitter", authedTwitter, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

app.use(securedRouter.middleware());

app.use(publicRouter.middleware());

// Default request
app.use(function *(next) {
    if (this.path !== "/") return yield next;

    var n = this.session.views || 0;
    this.session.views = ++n;
    this.body = "hello world! " + n + " views";
});

app.use(function *(next) {
    if (this.path !== "/login") return yield next;

    this.body = "Login page (coming soon)";
});

app.use(function *(next) {
    if (this.path !== "/success") return yield next;

    this.body = "You have successfully logged in!";
});

app.listen(3000);

