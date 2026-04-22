'use strict';

const bcrypt = require('bcryptjs');
const { config } = require('../config/environment');

const hashPassword = (password) => bcrypt.hash(password, config.bcrypt.saltRounds);

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = { hashPassword, comparePassword };
