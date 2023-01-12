const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const webdriver = require("selenium-webdriver"),
  By = webdriver.By,
  Key = webdriver.Key,
  Select = webdriver.Select;

const options = new chrome.Options();
options.addArguments("--incognito");

const justinLogin = {
  unid: "u1195351",
  password: "$Eedfulbore614",
  email: "u1195351@umail.utah.edu",
  name: "justin",
};

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

  //await driver.findElement(By.id("BeginPeriod")).selectByValue("08:40:00");

  //const begin = await $("#BeginPeriod");
  new Select(driver.findElement(By.id("BeginPeriod"))).selectByValue(
    "13:40:00"
  );
  new Select(driver.findElement(By.id("EndPeriod"))).selectByValue("16:40:00");

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

let date = new Date();
async function runScraper() {
  for (let i = 1; i <= 10; i++) {
    let day = date.getDate() + i;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;
    //console.log("currentDate :>> ", currentDate);

    await startScrape(justinLogin, currentDate);
  }
}
runScraper();
