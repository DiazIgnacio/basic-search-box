import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      `https://www.amazon.com/s?k=${req.query.searchQuery}`
    );
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const items = document.querySelectorAll('.s-result-item');
    // convert items into an array of objects
    // where each object has the title and price and image src
    // remove items that don't have a title or price or image
    const itemsArray = Array.from(items).map((item) => {
      const title = item.querySelector('.a-size-medium');
      const price = item.querySelector('.a-offscreen');
      const image = item.querySelector('.s-image');
      if (!title || !price || !image) {
        return null;
      }
      return {
        title: title.textContent,
        price: price.textContent,
        image: image?.getAttribute('src'),
      };
    });

    const filteredItemsArray = itemsArray.filter((item) => item !== null);

    res.setHeader('Content-Type', 'text/html');
    res.send(filteredItemsArray);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
