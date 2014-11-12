"use strict"

var passport = require("koa-passport");
var GithubStrategy = require("passport-github").Strategy;
var FacbookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;

passport.use(new GithubStrategy({
        clientID: "4d554d29ea31a6413c31",
        clientSecret: "3f14685ade7569d1cfffa9aca4baf2253d9d3b5c",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // Based on profile returned from GitHub, find existing user
        let user = profile;

        // Return user model
        return done(null, user);
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;
