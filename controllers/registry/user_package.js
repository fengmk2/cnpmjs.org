/**!
 * cnpmjs.org - controllers/registry/user_package.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const packageService = require('../../services/package');

// GET /-/by-user/:user
exports.list = function* () {
  const users = this.params.user.split('|');
  if (users.length > 20) {
    this.status = 400;
    this.body = {
      error: 'bad_request',
      reason: 'reach max user names limit, must <= 20 user names',
    };
    return;
  }

  const firstUser = users[0];
  if (!firstUser) {
    // params.user = '|'
    this.body = {};
    return;
  }

  const tasks = {};
  for (let i = 0; i < users.length; i++) {
    const username = users[i];
    tasks[username] = packageService.listPublicModuleNamesByUser(username);
  }

  const data = yield tasks;
  for (const k in data) {
    if (data[k].length === 0) {
      data[k] = undefined;
    }
  }
  this.body = data;
};
