const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  Key = webdriver.Key,
  Select = webdriver.Select;

const options = new chrome.Options();
options.addArguments("--incognito");
options.addArguments("--headless");

const justinLogin = {
  unid: "u1248103",
  email: "u1248103@umail.utah.edu",
  name: "justin",
  beginTime: "07:30:00", // 14:30:00 utc
  endTime: "10:30:00",
};
const jakeLogin = {
  unid: "u1195351",
  email: "u11955351@umail.utah.edu",
  name: "jake",
  beginTime: "10:40:00", // 17:40 utc
  endTime: "13:40:00",
};
const joeLogin = {
  unid: "u1252756",
  email: "u1252756@umail.utah.edu",
  name: "joe",
  beginTime: "13:50:00", // 20:50:00 utc
  endTime: "16:50:00",
};
const kadenLogin = {
  unid: "u1189630",
  email: "u1189630@umail.utah.edu",
  name: "kaden",
  beginTime: "17:00:00", // 00:00:00 utc
  endTime: "20:00:00",
};

async function startScrape(user, date, password) {
  try {
    const driver = new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.get("https://lib.utah.edu/spaces/classrooms/study-rooms.php");

    await driver
      .findElement(By.xpath("//*[text()='Reserve a study room']"))
      .sendKeys("Selenium", Key.RETURN);

    await driver.findElement(By.id("username")).sendKeys(user.unid);
    await driver.findElement(By.id("password")).sendKeys(password);

    await driver
      .findElement(By.name("submit"))
      .sendKeys("Selenium", Key.RETURN);

    await driver.get(
      `https://scheduling.tools.lib.utah.edu/Web/reservation.php?rid=47&sid=1&rd=${date}&sd=${date}`
    );

    new Select(driver.findElement(By.id("BeginPeriod"))).selectByValue(
      user.beginTime
    );
    new Select(driver.findElement(By.id("EndPeriod"))).selectByValue(
      user.endTime
    );

    await driver
      .findElement(By.name("reservationTitle"))
      .sendKeys(`${user.name} HuddleUp`);
    await driver
      .findElement(By.name("reservationDescription"))
      .sendKeys("Huddling");
    await driver.findElement(By.id("psiattribute[1]")).sendKeys("4");
    await driver.findElement(By.id("psiattribute[2]")).sendKeys(user.name);
    await driver.findElement(By.id("psiattribute[7]")).sendKeys(user.email);
    await driver.findElement(By.id("psiattribute[4]")).sendKeys("CS");

    await driver
      .findElement(
        By.xpath(
          "/html/body/div[1]/div[1]/div[3]/div/form/div[8]/div[2]/button[1]"
        )
      )
      .sendKeys("Selenium", Key.RETURN);
  } catch (e) {
    console.log(`failed to reserve ${date} with ${user.name}`);
  } finally {
    driver.close();
    console.log(`${user.name} reserved ${date}`);
  }
}

async function reserveNext10Days() {
  for (let i = 0; i <= 10; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;

    if (date.getDay() == 6 || date.getDay() == 0) return;

    if (!process.argv[2] || !process.argv[3]) return;

    await startScrape(justinLogin, currentDate, process.argv[2]);
    await startScrape(jakeLogin, currentDate, process.argv[3]);
    await startScrape(joeLogin, currentDate, process.argv[4]);
    await startScrape(kadenLogin, currentDate, process.argv[5]);
  }
}

async function runScraper() {
  let date = new Date();
  date.setDate(date.getDate() + 10);
  date.setHours(date.getHours() - 7);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`;
  console.log(date.getDay());

  if (date.getDay() == 6 || date.getDay() == 0) return;

  if (!process.argv[2] || !process.argv[3]) return;

  const password = process.argv[3];

  let user;
  switch (process.argv[2]) {
    case "jake":
      user = jakeLogin;
      break;
    case "justin":
      user = justinLogin;
      break;
    case "joe":
      user = joeLogin;
      break;
    case "kaden":
      user = kadenLogin;
      break;
    default:
      break;
  }
  await startScrape(user, currentDate, password);
}
runScraper();
// reserveNext10Days();
