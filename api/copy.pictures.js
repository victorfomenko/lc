var rp = require('request-promise-native');
const tr = require("transliteration");

const app = require('./app');
const pictures = app.service('pictures');
const users = app.service('users');
const uploads = app.service('uploads');

const createdUsers = {};

app
  .setup()
  .then(e => {
    return rp({
      uri: 'https://lovecanvas.ru/ajax/getListOfPic.php',
      // json: true, // not work
      method: 'POST',
      body: '1000', // set limit
    })
  })
  .then(r => JSON.parse(r))
  .then(pics => {
    console.log('Pics', pics.length)

    return Promise.all(pics.map(pic => {
      return Promise.all([
        rp({ uri: 'https://lovecanvas.ru/static/' + pic.preview, encoding: null })
          .then(data => {
            return uploads.create({
              type: 'picture-preview',
              uri: 'data:image/gif;base64,' + data.toString('base64'),
              name: pic.seourl + '.jpg',
            })
          }),
        rp({ uri: 'https://lovecanvas.ru/static/' + pic.full, encoding: null })
          .then(data => {
            return uploads.create({
              type: 'picture-preview',
              uri: 'data:image/gif;base64,' + data.toString('base64'),
              name: pic.seourl + '.jpg',
            })
          }),
        createdUsers[pic.author]
        || (createdUsers[pic.author] = users.create({ name: pic.author, url: tr.slugify(pic.author) })),
      ])
        .then(([previewFile, fullFile, createdUser]) => {
          return pictures.create({
            name: pic.name,
            url: pic.seourl,
            rate: pic.rate,
            fee: pic.fee,

            preview: {
              file: previewFile.id,
              width: pic.width,
              height: pic.height,
            },

            full: {
              file: fullFile.id,
              // width: calc width,
              // height: calc height,
            },

            userId: createdUser.id
          });
        });
    }))
  })
  .then(r => console.log('Success!'))
  .catch(console.error.bind(console));