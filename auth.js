"use strict"

var passport = require("koa-passport");
var GithubStrategy = require("passport-github").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GoogleStrategy = require("passport-google").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;

// GitHub Strategy
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

// Facebook Strategy
passport.use(new FacebookStrategy({
        clientID: "825570917465750",
        clientSecret: "e1f5e2210d294419b739700e65022242",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    })
);

// Google Strategy
passport.use(new GoogleStrategy({
        returnURL: "http://localhost:3000/auth/google/callback",
        realm: "http://localhost:3000"
    },
    function(identifier, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    })
);

// Twitter Strategy
passport.use(new TwitterStrategy({
        consumerKey: "owOlMXUfyefdRXoTFo5oP0j0n",
        consumerSecret: "c9H9rJawjMljDUXgKPkM7pwYJtN3Ds7UJrhM7mIpUegu2KDNud",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;
