const puppeteer = require("puppeteer");
const fs = require("fs");
const url = "https://www.reddit.com/r/FreeGameFindings/"; //Enter The Page To Be Liked Here

const file = fs.createWriteStream("Games.txt");

(async () => {
  try {
    const browser = await puppeteer.launch({
      args: ["--start-maximized"],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36 OPR/75.0.3969.267"
    );

    await page.setViewport({
      width: 1536,
      height: 824,
    });

    await page.goto(url);

    await page.waitForNetworkIdle();

    let allGames = await page.evaluate(() =>
      [...document.querySelectorAll("._2SdHzo12ISmrC8H86TgSCp")].map(
        (elem) => elem.innerText
      )
    );

    const regex = /(Game)|(Beta)/;

    allGames.splice(0, 2);
    allGames = allGames.filter((value) => regex.test(value));

    file.on("error", function (err) {
      Console.log(err);
    });
    allGames.forEach((value) => file.write(`${value}\r\n`));
    file.end();

    await browser.close();
  } catch (err) {
    console.log(err.message);
  }
})();
