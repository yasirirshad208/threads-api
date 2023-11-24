const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');

// Define the strategies for Google, Facebook, and Apple
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost/auth/google/callback',
  }, (accessToken, refreshToken, profile, done) => {
    // Handle Google authentication here, e.g., save user data to a database
    return done(null, profile);
  }));
  
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost/auth/facebook/callback',
  }, (accessToken, refreshToken, profile, done) => {
    // Handle Facebook authentication here, e.g., save user data to a database
    return done(null, profile);
  }));
  
  passport.use(new AppleStrategy({
    clientID: 'YOUR_APPLE_CLIENT_ID',
    teamID: 'YOUR_APPLE_TEAM_ID',
    keyID: 'YOUR_APPLE_KEY_ID',
    key: 'YOUR_APPLE_PRIVATE_KEY',
    callbackURL: 'http://localhost/auth/apple/callback',
  }, (accessToken, refreshToken, profile, done) => {
    // Handle Apple authentication here, e.g., save user data to a database
    return done(null, profile);
  }));
  
  // Serialize and deserialize user for session management
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  