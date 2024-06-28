import express from 'express';
import axios from 'axios';

const router = express.Router();

const clientId = 'eeaa4ce3f0f9dead59976630539acd41'; // Replace with your JDoodle client ID
const clientSecret = 'b949922e290e9d5205a4b3f0b3389a3f6eda612912731ca35984df774e765542'; // Replace with your JDoodle client secret

router.post('/compile', async (req, res) => {
    const { code, language, input } = req.body;

    const languageMapping = {
        'C++': 'cpp17',
        'Java': 'java',
        'Javascript': 'nodejs',
        'Python': 'python3'
    };

    const script = {
        script: code,
        stdin: input,
        language: languageMapping[language],
        versionIndex: '0',
        clientId: clientId,
        clientSecret: clientSecret
    };
    console.log("script : ", script)
    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', script);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error executing code' });
    }
});

export default router;
