'use strict';

const path = require('path');

const feathersErrors = require('feathers-errors');
const crypto = require('crypto');
const dauria = require('dauria');

function generateUniqIdBeforeCreate(hook) {
  const { type, name } = hook.data || {};

  const subDirByType = {
    'avatar': 'avatars',
    'picture-preview': 'pictures/previews/',
    'picture-original': 'pictures/originals/',
  };

  const subDir = subDirByType[type];

  if (!subDir) {
    throw new feathersErrors.BadRequest('Unknown type, allowed: ' + Object.keys(subDirByType));
  }

  return new Promise(function (resolve, reject) {
    crypto.randomBytes(37, function (err, buffer) {
      if (err) {
        return reject(err);
      }

      const uniqFileKey = buffer.toString('hex');

      hook.data.id = path.join(
        subDir,
        uniqFileKey,
        encodeURIComponent(name || 'no-name')
      );

      return resolve(hook);
    });
  });
}

function convertMultiPartFileToBase64(hook) {
  if (!hook.data.uri && hook.params.file) {
    const file = hook.params.file;

    hook.data.uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
    hook.data.name = file.originalname;
  }

  return Promise.resolve(hook);
}

function removeUriAfterCreate(hook) {
  delete hook.result.uri;
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      convertMultiPartFileToBase64,
      generateUniqIdBeforeCreate,
    ],
    update: [
      convertMultiPartFileToBase64
    ],
    patch: [
      convertMultiPartFileToBase64
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      removeUriAfterCreate
    ],
    update: [
      removeUriAfterCreate
    ],
    patch: [
      removeUriAfterCreate
    ],
    remove: [
      removeUriAfterCreate
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
