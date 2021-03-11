const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const newsList = [];

const URL =
  "https://sports.news.naver.com/basketball/news/index.nhn?page=1&isphoto=N";

//TODO: File Management

//TODO: Directory management
(async () => {
  require("./fileControl");

  //TODO: puppeteer
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(URL);

  //TODO: news-item length
  await page.waitForSelector("#_newsList > ul");
  let newsNode = await page.$eval("#_newsList > ul", (uiElement) => {
    return uiElement.children;
  });
  let newsLength = Object.keys(newsNode).length;

  //TODO: pages length
  await page.waitForSelector("#_pageList");
  const pageNode = await page.$eval("#_pageList", (uiElement) => {
    return uiElement.children;
  });
  const pageLength = Object.keys(pageNode).length;
  console.log("Total Page Length: " + pageLength + "\n");

  //TODO: Scraping
  for (let pageNum = 2; pageNum <= pageLength + 1; pageNum++) {
    if (pageNum >= 12) break; //10 pages max
    const tempNews = [];
    //TODO: Get # of articles in the current page
    await page.waitForSelector("#_newsList > ul");
    newsNode = await page.$eval("#_newsList > ul", (uiElement) => {
      return uiElement.children;
    });
    newsLength = Object.keys(newsNode).length;
    console.log(`Current Page: ${pageNum - 1} | # of articles: ${newsLength}`);

    //TODO: Process the current page
    for (let i = 1; i <= newsLength; i++) {
      if (i > newsLength) break;
      await page.waitForSelector(
        `#container #content .news_wrap .content .content_area .news_list ul li:nth-child(${i}) .text a`
      );
      const element = await page.$(
        `#container #content .news_wrap .content .content_area .news_list ul li:nth-child(${i}) .text a span`
      );
      const text = await page.evaluate(
        (element) => element.textContent,
        element
      );

      //TODO: push articles per page to the array
      tempNews.push(text);
      await page.click(
        `#container #content .news_wrap .content .content_area .news_list ul li:nth-child(${i}) .text a`
      );
      //TODO: screenshot
      await page.screenshot({
        path: `screenshot/screenshot${pageNum - 1}-${i}.jpg`,
      });
      await page.goBack();
    }

    //TODO: One page complete -> save data & go to next page
    newsList.push(tempNews);
    console.log(`Total of ${newsLength} has been scraped\n`);
    if (pageNum > pageLength) break;
    await page.goto(
      `https://sports.news.naver.com/basketball/news/index.nhn?page=${pageNum}&isphoto=N`
    );
  }

  let total_cnt = 0;
  //TODO: Save to data.txt
  newsList.forEach((news) => {
    total_cnt += news.length;
    news.forEach((header) => {
      header = `-> ${header}`;
      fs.appendFileSync("./data.txt", `${header}\n`, (err) => {
        if (err) throw err;
        console.log("File Written Successfully!");
      });
    });
  });
  console.log(newsList);
  console.log(`# of Total Articles Scraped: ${total_cnt}`);
})();
