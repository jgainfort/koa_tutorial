"use strict"

var Router = require("koa-router");
var session = require("koa-generic-session");
var redisStore = require("koa-redis");
var views = require("co-views");
var staticCache = require("koa-static-cache");
var passport = require("./auth");

var koa = require("koa");
var app = koa();

var files = {};

app.use(staticCache(__dirname + "/static/css", {}, files));
staticCache(__dirname + "/static/images", {}, files);
staticCache(__dirname + "/static/js", {}, files);

app.keys = ["keys", "keyskeys"];
app.use(session("."));

var render = views("templates", {
    map: {html: "swig"}
});

// Middleware: request logger
function *reqLogger(next) {
    console.log("%s - %s '%s'",  new Date().toISOString(), this.req.method, this.req.url);
    yield next;
}
app.use(reqLogger);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session({
    cookie: {maxage: 1000 * 60 * 5},
    store: redisStore()
}));

var publicRouter = new Router();

// Configure /auth/github and /auth/github/callback
publicRouter.get("/auth/github", passport.authenticate("github", {scope: ["user", "repo"]}));
publicRouter.get("/auth/github/callback", passport.authenticate("github", {successReturnToOrRedirect: "/success", failureRedirect: "/login"}));

publicRouter.get("/auth/facebook", passport.authenticate("facebook"));
publicRouter.get("/auth/facebook/callback", passport.authenticate("facebook", {successReturnToOrRedirect: "/success", failureRedirect: "/login"}));

publicRouter.get("/auth/google", passport.authenticate("google"));
publicRouter.get("/auth/google/callback", passport.authenticate("google", {successReturnToOrRedirect: "/success", failureRedirect: "/login"}));

publicRouter.get("/auth/twitter", passport.authenticate("twitter"));
publicRouter.get("/auth/twitter/callback", passport.authenticate("twitter", {successReturnToOrRedirect: "/success", failureRedirect: "/login"}));

app.use(publicRouter.middleware());

// Secure routes
var securedRouter = new Router();

// Middleware: authed for GitHub
function *authedGithub(next) {
    if (this.req.isAuthenticated()) yield next;
    else {
        //Set redirect path in session
        this.session.returnTo = this.session.returnTo || this.req.url;
        this.redirect("/auth/github");
    }
}

// Middleware: authed for Facebook
function *authedFacebook(next) {
    if (this.req.isAuthenticated()) yield next;
    else {
        this.session.returnTo = this.session.returnTo || this.req.url;
        this.redirect("/auth/facebook");
    }
}

//Middleware: authed for Google
function *authedGoogle(next) {
    if (this.req.isAuthenticated()) yield next;
    else {
        this.session.returnTo = this.session.returnTo || this.req.url;
        this.redirect("/auth/google");
    }
}

function *authedTwitter(next) {
    if (this.req.isAuthenticated()) yield next;
    else {
        this.session.returnTo = this.session.returnTo || this.req.url;
        this.redirect("/auth/twitter");
    }
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

// Default request
app.use(function *(next) {
    if (this.path !== "/") return yield next;

    var session = this.session;
    session.count = session.count || 0;
    session.count++;

    this.body = "hello world!\nCount: " + session.count;
});

app.use(function *(next) {
    if (this.path !== "/login") return yield next;

    this.body = yield render("index");
});

app.use(function *(next) {
    if (this.path !== "/success") return yield next;

    this.body = "You have successfully logged in!";
});

app.listen(3000);

