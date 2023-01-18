const express = require('express');
const app = express();

const dabangCrawling = require('./modules/dabang');
const zigbangCrawling = require("./modules/zigbang");

const run = async () => {
  await dabangCrawling();
  // await zigbangCrawling();
  return
}

addId = async (arr, room) => {
  arr.push(room)
}

sleep = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
}


run();