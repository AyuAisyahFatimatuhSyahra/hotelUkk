const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const SECRET_KEY = 'hotelmahal';

const auth = require('../middleware/auth');
const { uploadUser } = require('../middleware/uploadImage');
const user = require('../models/index').user;

const app = express();

/**
 * @apiRoutes {get} /hotel/user/
 * @apiName GetAllUsers
 * @apiGroup User
 * @apiDescription Get all users data
 */
app.get('/', async (req, res) => {
    await user.findAll()
        .then(result => res.json({ data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {get} /hotel/user/:id
 * @apiName GetUsersById
 * @apiGroup User
 * @apiDescription Get users data by id
 */
app.get('/:id', async (req, res) => {
    let params = { id_user: req.params.id };

    await user.findOne({ where: params })
        .then(result => res.json({ data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/user/
 * @apiName PostUser
 * @apiGroup User
 * @apiDescription Insert user data
 */
app.post('/', uploadUser.single('foto'), async (req, res) => {
    if (!req.file) return res.json({ message: "No file uploaded" })

    let finalImageURL = req.protocol + '://' + req.get('host') + '/user/' + req.file.filename;

    let data = {
        nama_user: req.body.nama_user,
        foto: finalImageURL,
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role
    }

    await user.create(data)
        .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {put} /hotel/user/
 * @apiName PutUser
 * @apiGroup User
 * @apiDescription Update user data
 */
app.put('/', uploadUser.single('foto'), auth, async (req, res) => {
    if (!req.file) return res.json({ message: "No file uploaded" })

    let params = { id_user: req.body.id_user }
    let data = {
        nama_user: req.body.nama_user,
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role
    }

    if (req.file) {
        let oldImg = await user.findOne({ where: params });
        let oldImgName = oldImg.foto;

        let loc = path.join(__dirname, '../foto/user/', oldImgName);
        fs.unlink(loc, (err) => console.log(err));

        let finalImageURL = req.protocol + '://' + req.get('host') + '/user/' + req.file.filename;
        data.foto = finalImageURL;
    }

    await user.update(data, { where: params })
        .then(result => res.json({ success: 1, message: "Data has been updated" }))
        .catch(error => res.json({ message: error.message }))
});


/**
 * @apiRoutes {delete} /hotel/user/:id
 * @apiName DeleteUser
 * @apiGroup User
 * @apiDescription Delete user data
 */
app.delete('/:id', async (req, res) => {
  let param = { id_user: req.params.id }
  try{
      let delImg = await user.findOne({ where: param });
      let delImgName = delImg.foto;

      let loc = path.join(__dirname, "../foto/user", delImgName);
      console.log(loc)
      await fs.unlink(loc, (err) =>{console.log(err)})
  }catch (err){
      console.log(err)
  }
  await user.destroy({ where: param })
      .then(result => res.json({ success: 1, message: "Data has been deleted" }))
      .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/user/
 * @apiName LoginUserAdmin
 * @apiGroup User
 * @apiDescription Login user admin
 */
app.post('/login', async (req, res) => {
    let params = {
      email: req.body.email,
      password: md5(req.body.password),
    }
  
    await user.findOne({ where: params })
    .then(result => {
      if(result) {
        let payload = JSON.stringify(result);
        let token = jwt.sign(payload, SECRET_KEY);
        res.json({ success: 1, message: "Login success, welcome back!", data: result, token: token })
      } else {
        res.json({ success: 0, message: "Invalid email or password!" })
      }
    })
    .catch(error => res.json({ message: error.message }))
  });

module.exports = app;