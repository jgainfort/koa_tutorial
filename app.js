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
app.use(publicRouter.middleware());

// Secure routes
var securedRouter = new Router();

// Middleware: authed
function *authed(next) {
    if (this.req.isAuthenticated()) yield next;
    else this.redirect("/auth/github");
}

securedRouter.get("/app", authed, function *() {
    this.body = "Secured Zone: koa-tutorial\n" + JSON.stringify(this.req.user, null, "\t");
});

app.use(securedRouter.middleware());

// Facebook authentication router
publicRouter.get("/auth/facebook", function *() {
    this.body = "Authenticate with Facebook OAUTH API (coming soon)";
});
app.use(publicRouter.middleware());

// Google authentication router
publicRouter.get("/auth/google", function *() {
    this.body = "Authenticate with Google OAUTH API (coming soon)";
});
app.use(publicRouter.middleware());

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

