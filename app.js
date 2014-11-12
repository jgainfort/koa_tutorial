"use strict"

var koa = require('koa');
var app = koa();

// Middleware: request logger
function *reqLogger(next) {
    console.log('%s - %s %s',  new Date().toISOString(), this.req.method, this.req.url);
    yield next;
}
app.use(reqLogger);

app.use(function *() {
    this.body = 'hello world!';
});

app.listen(3000);
