const { promise } = require('selenium-webdriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const run = async () => {
  // headless로 크롬 드라이버 실행
  let driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless().addArguments("--disable-gpu", "window-size=1920x1080",
    //   "lang=ko_KR"))
    .build();

  try {
    // 특정 URL 생성

    let userAgent = await driver.executeScript("return navigator.userAgent;")
    console.log('[UserAgent]', userAgent);

    await driver.get('https://www.dabangapp.com/api/3/room/new-list/multi-room/bbox?api_version=3.0.1&call_type=web&filters=%7B%22multi_room_type%22%3A%5B0%2C1%2C2%5D%2C%22selling_type%22%3A%5B0%2C1%2C2%5D%2C%22deposit_range%22%3A%5B0%2C999999%5D%2C%22price_range%22%3A%5B0%2C999999%5D%2C%22trade_range%22%3A%5B0%2C999999%5D%2C%22maintenance_cost_range%22%3A%5B0%2C999999%5D%2C%22room_size%22%3A%5B0%2C999999%5D%2C%22supply_space_range%22%3A%5B0%2C999999%5D%2C%22room_floor_multi%22%3A%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C-1%2C0%5D%2C%22division%22%3Afalse%2C%22duplex%22%3Afalse%2C%22room_type%22%3A%5B1%2C2%5D%2C%22use_approval_date_range%22%3A%5B0%2C999999%5D%2C%22parking_average_range%22%3A%5B0%2C999999%5D%2C%22household_num_range%22%3A%5B0%2C999999%5D%2C%22parking%22%3Afalse%2C%22short_lease%22%3Afalse%2C%22full_option%22%3Afalse%2C%22built_in%22%3Afalse%2C%22elevator%22%3Afalse%2C%22balcony%22%3Afalse%2C%22safety%22%3Afalse%2C%22pano%22%3Afalse%2C%22is_contract%22%3Afalse%2C%22deal_type%22%3A%5B0%2C1%5D%7D&location=%5B%5B126.2074584%2C37.0517592%5D%2C%5B127.5670165%2C38.0522885%5D%5D&page=1&version=1&zoom=10');

    let source = await driver.findElement(By.tagName('pre')).getText()
    const sourceObj = JSON.parse(source);
    console.log(sourceObj.sign_verified_rooms)


    // // By.id로 #query Element를 얻어온다.
    // let searchInput = await driver.findElement(By.id('search.keyword.query'));
    // // keyword를 선택하고 검색 버튼 사용
    // let keyword = "닭발";
    // searchInput.sendKeys(keyword, Key.ENTER);

    // // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
    // await driver.wait(until.elementLocated(By.id('info.search.place.list')), 10000);
    // let resultElements = await driver.findElements(By.className("placetit"));

    // // 검색한 elements 하위의 value를 출력함
    // console.log('[resultElements.length]', resultElements.length)
    // for (var i = 0; i < resultElements.length; i++) {
    //   console.log('- ' + await resultElements[i].getCssValue())
    // }
  }
  catch (e) {
    console.log(e);
  }
  // finally {
  //   driver.quit();
  // }
}
run();