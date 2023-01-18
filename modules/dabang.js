const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const addressValidate = require('../modules/addressValidate');
const createCsvWriter = require("csv-writer").createArrayCsvWriter;

module.exports = dabangCrawling = async () => {
  let records = [];
  let arrDabang = [];

  const csvWriter = createCsvWriter({
    path: `csv/dabang.csv`,
    header: ["address", "url", 'platform'],
  });

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
    let userAgent = await driver.executeScript("return navigator.userAgent;");
    console.log("[UserAgent]", userAgent);

    for (let i = 3; i <= 3; i++) {
      // HTML 불러와서 객체 구조로 바꾸는 작업
      await driver.get(
        `https://www.dabangapp.com/api/3/room/new-list/multi-room/bbox?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C1%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B1%2C2%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22built_in%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B126.6727999%2C37.1882345%5D%2C%5B127.4239901%2C37.7680155%5D%5D&page=${i}&version=1&zoom=11`
      );
      let source = await driver.findElement(By.tagName("pre")).getText();
      const sourceObj = await JSON.parse(source);

      if (sourceObj.sign_verified_rooms.length != 0) {
        for (let num = 0; num < sourceObj.sign_verified_rooms.length; num++) {
          await addId(arrDabang, sourceObj.sign_verified_rooms[num].id)
        }
      } else if (sourceObj.rooms.length != 0) {
        for (let num = 0; num < sourceObj.rooms.length; num++) {
          await addId(arrDabang, sourceObj.rooms[num].id)
        }
      }

      await sleep(3000).then(() => console.log(`아이디값 긁어 오는중.... ${100 / 415 * i}%`));

    }

    // 다방에서 방 유형을 둘로 나눔 그래서 if문으로 구별해 줘야함.
    for (let num = 0; num < arrDabang.length; num++) {
      if (arrDabang[num][0] == 'S') {
        await driver.get(`https://www.dabangapp.com/sign/${arrDabang[num]}`)
        await sleep(3000).then(() => console.log(`다방 주소 크롤링중.... ${num * 0.25}%`));
        let address = await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div/div[2]/div/div/div[3]/p`)).getText()

        // 데이터 구조의 통일성을 위해 지번주소 형식 통일
        address = await addressValidate(address);

        records.push([address, `https://www.dabangapp.com/sign/${arrDabang[num]}`])

      } else {
        await driver.get(`https://www.dabangapp.com/room/${arrDabang[num]}`)
        await sleep(3000).then(() => console.log(`다방 주소 크롤링중.... ${num * 0.25}%`));
        let address = await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div/div[2]/div/div/div[3]/p`)).getText()

        // 데이터 구조의 통일성을 위해 지번주소 형식 통일
        address = await addressValidate(address);

        records.push([address, `https://www.dabangapp.com/sign/${arrDabang[num]}`, '다방'])
      }

    }

  } catch (err) {
    console.log('error', err);
  }
}
