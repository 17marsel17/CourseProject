import UserModule from '../module/UserModule.js';
import { signin } from './signin.js';
import { signup } from './signup.js';

const userModule = new UserModule();

export const initAuth = function (passport) {
  console.log('initAuth');
  passport.serializeUser(function (user, done) {
    console.log(`serializing user: ${user}`);
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    userModule.findById(id, function (err, user) {
      console.log(`deserializing user: ${user}`);
      done(err, user);
    });
  });

  signin(passport);
  signup(passport);
};
