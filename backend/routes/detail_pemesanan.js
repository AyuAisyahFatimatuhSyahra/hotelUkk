const express = require('express');
const path = require('path');
const fs = require('fs');

const auth = require('../middleware/auth');
const detail_pemesanan = require('../models/index').detail_pemesanan;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * @apiRoutes {get} /hotel/detail_pemesanan/
 * @apiName GetAllTypeRoom
 * @apiGroup TypeRoom
 * @apiDescription Get all type room data
 */
app.get('/', async (req, res) => {
    await detail_pemesanan.findAll()
        .then(result => res.json({ data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {get} /hotel/tipe_kamar/:id
 * @apiName GetTypeRoomById
 * @apiGroup TypeRoom
 * @apiDescription Get type room data by id
 */
app.get('/:id', async (req, res) => {
    let params = { id_pemesanan: req.params.id };

    await detail_pemesanan.findAll({ where: params, include: ['kamar'] })
        .then(result => res.json({ data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {post} /hotel/tipe_kamar/
 * @apiName PostTypeRoom
 * @apiGroup TypeRoom
 * @apiDescription Insert type room data
 */
app.post('/', async (req, res) => {
    let data = {
        id_pemesanan: req.body.id_pemesanan,
        id_kamar: req.body.id_kamar,
        tgl_akses: req.body.tgl_akses,
        harga: req.body.harga,
    }

    await detail_pemesanan.create(data)
        .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {put} /hotel/detail_pemesanan/
 * @apiName PutTypeRoom
 * @apiGroup TypeRoom
 * @apiDescription Update detail_pemesanan data
 */
app.put('/', async (req, res) => {
    let params = { id_pemesanan: req.body.id_pemesanan }
    let data = {
        id_pemesan: req.body.id_pemesan,
        id_kamar: req.body.id_kamar,
        tgl_akses: req.body.tgl_akses,
        harga: req.body.harga,
    }
    await detail_pemesanan.update(data, { where: params })
        .then(result => res.json({ success: 1, message: "Data has been updated" }))
        .catch(error => res.json({ message: error.message }))
});

/**
 * @apiRoutes {delete} /hotel/detail_pemesanan/:id
 * @apiName DeleteTypeRoom
 * @apiGroup TypeRoom
 * @apiDescription Delete type room data
 */
app.delete('/:id', async (req, res) => {
    let params = { id_detail_pemesanan: req.params.id}

    await detail_pemesanan.destroy({ where: params })
        .then(result => res.json({ success: 1, message: "Data has been deleted" }))
        .catch(error => res.json({ message: error.message }))
});

module.exports = app;