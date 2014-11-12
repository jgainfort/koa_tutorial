"use strict"

var Router = require("koa-router");
var passport = require("./auth");

var koa = require("koa");
var app = koa();

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
publicRouter.get("/auth/github/callback", passport.authenticate("github", {successRedirect: "/", failureRedirect: "/"}));

publicRouter.get("/auth/facebook", passport.authenticate("facebook"));
publicRouter.get("/auth/facebook/callback", passport.authenticate("facebook", {successRedirect: "/", failureRedirect: "/login"}));

publicRouter.get("/auth/google", passport.authenticate("google"));
publicRouter.get("/auth/google/callback", passport.authenticate("google", {successRedirect: "/", failureRedirect: "/login"}));

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

securedRouter.get("/github", authedGithub, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

securedRouter.get("/facebook", authedFacebook, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

securedRouter.get("/google", authedGoogle, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

app.use(securedRouter.middleware());

// Twitter authentication router
publicRouter.get("/auth/twitter", function *() {
    this.body = "Authenticate with Twitter OAUTH API (coming soon)";
});
app.use(publicRouter.middleware());

// Default request
app.use(function *() {
    this.body = "hello world!";
});
app.listen(3000);

