const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

module.exports = dabangCrawling = async () => {
  let arr = [];
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

    for (let i = 1; i <= 1; i++) {
      // HTML 불러와서 객체 구조로 바꾸는 작업
      await driver.get(
        `https://www.dabangapp.com/api/3/room/new-list/multi-room/bbox?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C1%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B1%2C2%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22built_in%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B126.6727999%2C37.1882345%5D%2C%5B127.4239901%2C37.7680155%5D%5D&page=${i}&version=1&zoom=11`
      );
      let source = await driver.findElement(By.tagName("pre")).getText();
      const sourceObj = await JSON.parse(source);

      // 한 페이지에 객체 요소가 24개가 들어 있음 다방은!
      for (let num = 0; num < 24; num++) {
        if (sourceObj.sign_verified_rooms.length != 0) {
          // 온라인거래 매물은 변수명이 다름
          await addId(arr, sourceObj.sign_verified_rooms[num].id)
        } else {
          // 일반거래 매물임
          await addId(arr, sourceObj.rooms[num].id)
        }
      }
      await sleep(3000).then(() => console.log(`다방 크롤링중.... ${i * 0.25}%`));

    }
    // 배열에 있는 것들을 메모장에 쓰는 작업
    // const text = arr.join(' ');
    // fs.writeFileSync(`${Date.now()} - dabangIds.txt`, text);

    for (let num = 0; num < arr.length; num++) {
      if (arr[num][0] == 'S') {
        let source = await driver.get(`https://www.dabangapp.com/sign/${arr[num]}`)
        await sleep(3000).then(() => console.log(`다방 주소 크롤링중.... ${num * 0.25}%`));
        const address = await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div/div[2]/div/div/div[3]/p`)).getText()
        console.log(address);
      } else {
        await driver.get(`https://www.dabangapp.com/room/${arr[num]}`)
        await sleep(3000).then(() => console.log(`다방 주소 크롤링중.... ${num * 0.25}%`));
        const address = await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div/div[2]/div/div/div[3]/p`)).getText()

        console.log(address);
      }

    }

  } catch (err) {
    console.log('error', err);
  }
}
