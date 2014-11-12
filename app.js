"use strict"

var koa = require("koa");
var Router = require("koa-router");
var app = koa();
var publicRouter = new Router();

// Middleware: request logger
function *reqLogger(next) {
    console.log("%s - %s '%s'",  new Date().toISOString(), this.req.method, this.req.url);
    yield next;
}
app.use(reqLogger);

// GitHub router
publicRouter.get("/auth/github", function *() {
    console.log("Middleware style example");
    this.body = "Authenticate with GitHub OAUTH API (coming soon)";
});
app.use(publicRouter.middleware());

// Facebook router
publicRouter.get("/auth/facebook", function *() {
    this.body = "Authenticate with Facebook OAUTH API (coming soon)";
});
app.use(publicRouter.middleware());

app.use(function *() {
    this.body = "hello world!";
});

app.listen(3000);

