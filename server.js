import express from 'express';
import axios from 'axios';
import { ScrapingBeeClient } from 'scrapingbee';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.static('public'));

const client = new ScrapingBeeClient({ api_key: '1XH31OV8HLA4GHMWSJ4P8OQQTLKZJGCKN3KHCY5XI83PVL1PTND6S1PBZAW2SF0C3SBYUU0VHJ4C3RYF' }); 

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAPU-BpFApL5pobHc5D5eUQfAo7TNxJfIQ&cx=17bd643297c924992&q=${query}`;
        const searchRes = await axios.get(searchUrl);

        if (!searchRes.data.items) {
            return res.status(400).json({ error: 'No results found' });
        }

        const topUrls = searchRes.data.items.slice(0, 5).map(item => item.link);
        const texts = [];

        for (let url of topUrls) {
            const response = await client.get({ url: url });
            var decoder = new TextDecoder();
            var text = decoder.decode(response.data);
            texts.push(text);
        }

        res.json({ texts });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ error: error.message });  
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));



