const axios = require('axios');
    const cheerio = require('cheerio');
    const { Parser } = require('json2csv');
    const fs = require('fs');

    async function fetchAmazonBestsellers() {
      const url = 'https://www.amazon.com/best-sellers-books-Amazon/zgbs/books';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const books = [];

      $('div.zg_itemWrapper').each((index, element) => {
        const title = $(element).find('div.p13n-sc-truncate').text().trim();
        const author = $(element).find('div.a-row.a-size-small').text().trim();
        books.push({ title, author });
      });

      return books;
    }

    async function fetchGoodreadsTrending() {
      const url = 'https://www.goodreads.com/trending';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const books = [];

      $('div.trending').each((index, element) => {
        const title = $(element).find('a.bookTitle').text().trim();
        const author = $(element).find('a.authorName').text().trim();
        books.push({ title, author });
      });

      return books;
    }

    async function saveDataToCSV(data) {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      fs.writeFileSync('book_trends.csv', csv);
    }

    async function main() {
      const amazonBooks = await fetchAmazonBestsellers();
      const goodreadsBooks = await fetchGoodreadsTrending();
      const allBooks = [...amazonBooks, ...goodreadsBooks];

      await saveDataToCSV(allBooks);
      console.log('Data collected and saved to book_trends.csv');
    }

    main().catch(console.error);
