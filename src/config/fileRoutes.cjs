const {resolve} = require('node:path');
const express = require('express');

const uploadpath = (resolve(__dirname,  '..', '..', 'uploads'));

const fileRouteConfig = express.static(uploadpath);

module.exports = fileRouteConfig;