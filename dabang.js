const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

module.exports = dabangCrawling = async () => {
  // headless로 크롬 드라이버 실행
  let driver = await new Builder()
    .forBrowser("chrome")
    // .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    //   "lang=ko_KR"))
    .build();

  try {
    let userAgent = await driver.executeScript("return navigator.userAgent;");
    console.log("[UserAgent]", userAgent);

    for (let i = 1; i <= 416; i++) {
      await driver.get(
        `https://www.dabangapp.com/api/3/room/new-list/multi-room/bbox?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C1%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B1%2C2%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22built_in%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B126.6727999%2C37.1882345%5D%2C%5B127.4239901%2C37.7680155%5D%5D&page=410&version=1&zoom=11`
      );
      let source = await driver.findElement(By.tagName("pre")).getText();
      const sourceObj = JSON.parse(source);
      console.log(sourceObj.sign_verified_rooms[i].id);
    }




  } catch (e) {
    console.log(e);
  }

};