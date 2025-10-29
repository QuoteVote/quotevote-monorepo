import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { AuthenticationError } from 'apollo-server-express';
import { logger } from './logger';
import UserModel from '../resolvers/models/UserModel';

export const createGuestUser = (req, res) => {
  logger.info(req.body);

  try {
    const randomUser = crypto.randomBytes(20)
      .toString('hex');
    const salt = bcrypt.genSaltSync(10);

    const userData = {
      name: 'guest',
      username: randomUser,
      email: `${randomUser}@gmail.com`,
      password: randomUser,
      hash_password: bcrypt.hashSync(randomUser, salt),
    };
    new UserModel(userData).save((err, user) => {
      if (err) throw err;
      res.send(user);
    });
  } catch (err) {
    res.status(401)
      .json(err);
  }
};

export const register = (req, res) => {
  logger.info(req.body);
  try {
    const requiredFields = ['name', 'email', 'username', 'password'];
    String.prototype.toProperCase = function () {
      return this.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0)
          .toUpperCase() + txt.substr(1)
          .toLowerCase();
      });
    };

    for (const requiredField of requiredFields) {
      if (!(requiredField in req.body)) {
        res.status(401)
          .json({
            error_message: `${requiredField.toProperCase()} is required.`,
          });
        return;
      }
    }

    const query = { username: req.body.username };
    UserModel.findOne(query, (err, user) => {
      if (err) throw err;
      if (user) {
        res.status(401)
          .json({
            error_message: `Username ${user.username} already exists!`,
          });
        return;
      }
      const {
        name, email, username, password, status
      } = req.body;
      const hash_password = generateHashPassword(password);
      const userData = {
        name,
        email,
        username,
        hash_password,
        status
      };

      const creatorData = {
        name,
        profileImageUrl: '',
        followers: [],
        created: new Date(),
        options: {},
      };

      new UserModel(userData).save((err, user) => {
        if (err) {
          return res.status(500).json({
            error_message: "Error saving user", error: err
          })
        }

        res.status(200).json({
          message: 'User registered successfully',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
          }
        })
      });
    });
  } catch (err) {
    res.status(401)
      .json(err);
  }
};

export const generateHashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const invalidUserPassword = (res) => {
  return res.status(401)
    .json({ message: 'Invalid username or password.' });
};

export const addCreatorToUser = async ({ username, password, requirePassword }, res, authenticate, expiresIn = (60 * 60 * 24), tokenOnly = false) => {
  let query;
  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(username)) {
    query = { email: username };
  } else {
    query = { username };
  }
  const user = await UserModel.findOne(query);

  if (!user) {
    return invalidUserPassword(res);
  }

  if (requirePassword) {
    const { hash_password } = user;
    const comparePassword = await bcrypt.compare(password, hash_password);
    if (!comparePassword) return invalidUserPassword(res);
  }

  let updatedUser = user || {};
  updatedUser = Object.keys(updatedUser).length > 0 ? updatedUser : user;
  const token = jwt.sign({
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    _id: updatedUser._id,
    admin: updatedUser.admin,
    primary: updatedUser.primary,
  },
  process.env.SECRET,
  { expiresIn });

  if (tokenOnly) {
    return token;
  }

  if (authenticate) {
    return res.json({
      token,
    });
  }

  return res.json({
    token,
    user: updatedUser,
  });
};

export const login = async (req, res) => {
  let errorMessage = '';
  if (!('username' in req.body)) {
    errorMessage = 'Username is required.';
  } else if (!('password' in req.body)) {
    errorMessage = 'Password is required.';
  }

  if (errorMessage !== '') {
    return res.status(401)
      .json({ message: errorMessage });
  }

  const { username, password } = req.body;
  await addCreatorToUser({
    username,
    password,
    requirePassword: true,
  }, res, false);
};

export const authenticate = async (req, res) => {
  console.log('authenticate', req.body);
  logger.info(req.body);
  let errorMessage = '';
  if (!('username' in req.body)) {
    errorMessage = 'Username is required.';
  } else if (!('password' in req.body)) {
    errorMessage = 'Password is required.';
  }

  if (errorMessage !== '') {
    return res.status(401)
      .json({ message: errorMessage });
  }
  const { username, password } = req.body;
  await addCreatorToUser({
    username,
    password,
    requirePassword: true,
  }, res, true);
};

export const verifyToken = async (authToken) => {
  const authSecret = process.env.SECRET;
  
  // Remove 'Bearer ' prefix if present
  const token = authToken.startsWith('Bearer ') ? authToken.substring(7) : authToken;
  
  const decodedJwtTokenRequest = jwt.decode(token, { complete: true });
  if (!decodedJwtTokenRequest) {
    throw new AuthenticationError('Auth token supplied is corrupted');
  }
  const user = { ...decodedJwtTokenRequest.payload };
  try {
    await jwt.verify(token, authSecret);
    return user;
  } catch (err) {
    logger.error(err.message);
    if (err.message === 'invalid issuer') {
      throw new AuthenticationError('Token issued cannot be used in this endpoint.');
    }
    if (err.name === 'JsonWebTokenError' || err.message === 'invalid signature') {
      throw new AuthenticationError(`Invalid access token because of ${err.message}`);
    } else if (err.name === 'TokenExpiredError') {
      throw new AuthenticationError('Access token has expired');
    }
  }
};
