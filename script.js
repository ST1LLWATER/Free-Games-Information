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

    const regex = /(Game)|(Beta)/;
    // .y8HYJ-y_lTUHkQIc1mdCq a
    // ._2FCtq-QzlfuN-SwVMUZMM3 div
    let allGames = await page.evaluate(() =>
      [...document.querySelectorAll(".y8HYJ-y_lTUHkQIc1mdCq")].map((elem) => {
        const remove = /Expired|(DLC)/g;
        const keep = /(Game)|(Beta)|(Other)/g;
        if (elem && elem.innerText) {
          //Check if elem and elem innerText exists
          if (!remove.test(elem.innerText) && keep.test(elem.innerText)) {
            return elem.innerText;
          } else {
            return null;
          }
        }
      })
    );

    allGames = allGames.filter((val) => val !== null);

    file.on("error", function (err) {
      console.log(err);
    });
    allGames.forEach((value) => file.write(`${value}\r\n`));
    file.end();

    await browser.close();
  } catch (err) {
    console.log(err.message);
  }
})();
