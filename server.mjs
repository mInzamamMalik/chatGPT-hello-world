import express, { urlencoded, json } from 'express';
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'

dotenv.config()



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
const PORT = process.env.PORT;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});


app.post('/query', (req, res) => {

    let result = await textGeneration(req.body.text);

    res.send({ text: result.response });
});



app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});

const textGeneration = async (prompt) => {

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Human: ${prompt}\nAI: `,
            temperature: 0.9,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
        });

        return {
            status: 1,
            response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        return {
            status: 0,
            response: ''
        };
    }
};