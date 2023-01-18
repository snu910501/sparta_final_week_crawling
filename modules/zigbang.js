const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const addressValidate = require("../modules/addressValidate");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;

const crawlingInit = async (url, number) => {
  let driver = await new Builder()
    .forBrowser("chrome")
    // .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    //   "lang=ko_KR"))
    .build();

  await driver.manage().setTimeouts({
    implicit: 10000, // 10초
    pageLoad: 30000, // 30초
    script: 30000, // 30초
  });

  try {
    let records = []; //csv에 담을 데이터를 저장하는 배열
    let arrZigbang = []; //크롤링한 매물들의 아이디를 저장하는 배열

    let userAgent = await driver.executeScript("return navigator.userAgent;");
    console.log("[UserAgent]", userAgent);

    const csvWriter = createCsvWriter({
      path: `csv/zigbang${number}.csv`,
      header: ["address", "url", 'platform'],
    });

    await driver.get(url);

    let source = await driver.findElement(By.tagName("pre")).getText();
    const sourceObj = await JSON.parse(source);
    console.log(sourceObj.items[0]);

    for (let num = 0; num < sourceObj.items.length; num++) {
      await addId(arrZigbang, sourceObj.items[num].item_id);
    }

    for (let num = 0; num < 5; num++) {
      await driver.get(`https://apis.zigbang.com/v2/items/${arrZigbang[num]}`);
      let source = await driver.findElement(By.tagName("pre")).getText();
      let sourceObj = await JSON.parse(source);
      console.log("bb", sourceObj.item.jibunAddress);
      records.push([
        sourceObj.item.jibunAddress,
        `https://www.zigbang.com/home/oneroom/items/${arrZigbang[num]}`,
        '직방'
      ]);
      await sleep(2000).then(() =>
        console.log(
          `직방 ${number} Worker Thread 주소 크롤링중.... ${((100 / arrZigbang.length) * num).toFixed(
            2
          )}%`
        )
      );
    }

    csvWriter.writeRecords(records).then(async () => {
      console.log("csv 완료");
    });
    arrZigbang = [];
  } catch (err) {
    console.log(err);
  }


};

module.exports = zigbangCrawling = async () => {
  try {

    const urlArr = [
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydh&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydj&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydn&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydk&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydm&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
      "https://apis.zigbang.com/v2/items?deposit_gteq=0&domain=zigbang&geohash=wydq&needHasNoFiltered=true&rent_gteq=0&sales_type_in=%EC%A0%84%EC%84%B8%7C%EC%9B%94%EC%84%B8&service_type_eq=%EC%9B%90%EB%A3%B8",
    ];


    crawlingInit(urlArr[0], 0);
    crawlingInit(urlArr[1], 1);
    crawlingInit(driver, urlArr[2], 2);
    crawlingInit(driver, urlArr[3], 3);
    crawlingInit(driver, urlArr[4], 4);
    crawlingInit(driver, urlArr[5], 5);

  } catch (err) {
    console.log(err);
  }
};
