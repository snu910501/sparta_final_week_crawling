const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const dabangCrawling = require('./modules/dabang');

const run = async () => {
  await dabangCrawling();
}

addId = async (arr, room) => {
  arr.push(room)
}

sleep = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
}


run();