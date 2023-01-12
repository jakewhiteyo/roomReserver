const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  Key = webdriver.Key,
  Select = webdriver.Select;

const options = new chrome.Options();
options.addArguments("--incognito");

const justinLogin = {
  unid: "u1248103",
  password: "Saint$24",
  email: "u1248103@umail.utah.edu",
  name: "justin",
  beginTime: "7:30",
  endTime: "10:30",
};
const jakeLogin = {
  unid: "u1195351",
  password: "$Eedfulbore614",
  email: "u11955351@umail.utah.edu",
  name: "jake",
  beginTime: "10:40",
  endTime: "13:40",
}
const joeLogin = {
  unid: "u1252756",
  password: "U1280132!",
  email: "u1252756@umail.utah.edu",
  name: "joe",
  beginTime: "13:50",
  endTime: "16:50",
}

const kadenLogin = {
  unid: "u1252756",
  password: "U1280132!",
  email: "u1252756@umail.utah.edu",
  name: "kaden",
  beginTime: "17:00",
  endTime: "20:00",
}

async function startScrape(user, date) {
  const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.get("https://lib.utah.edu/spaces/classrooms/study-rooms.php");

  await driver
    .findElement(By.xpath("//*[text()='Reserve a study room']"))
    .sendKeys("Selenium", Key.RETURN);

  await driver.findElement(By.id("username")).sendKeys(user.unid);
  await driver.findElement(By.id("password")).sendKeys(user.password);

  await driver.findElement(By.name("submit")).sendKeys("Selenium", Key.RETURN);

  await driver.get(
    `https://scheduling.tools.lib.utah.edu/Web/reservation.php?rid=47&sid=1&rd=${date}&sd=${date}`
  );

  new Select(driver.findElement(By.id("BeginPeriod"))).selectByValue(
    user.beginTime
  );
  new Select(driver.findElement(By.id("EndPeriod"))).selectByValue(user.endTime);

  await driver.findElement(By.name("reservationTitle")).sendKeys("HuddleUp");
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

  driver.close();
}

async function runScraper() {
    let date = new Date();
    let day = date.getDate() + 10;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;

    if(process.argv[2] === 'jake')
    {
      await startScrape(jakeLogin, currentDate, );
    }
    else if(process.argv[2] === 'justin')
    {
      await startScrape(justinLogin, currentDate);
    }
    else if(process.argv[2] === 'joe')
    {
      await startScrape(joeLogin, currentDate);
    }
    else
    {
      await startScrape(kadenLogin, currentDate);
    }
}
runScraper();
