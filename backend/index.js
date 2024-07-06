const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executeC } = require('./executeC');
const { executePython } = require('./executePython');
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        let output;
        
        switch (language) {
            case 'cpp':
                output = await executeCpp(filePath, inputPath);
                break;
            case 'c':
                output = await executeC(filePath, inputPath);
                break;
            case 'python':
                output = await executePython(filePath, inputPath);
                break;
           
            default:
                return res.status(400).json({ success: false, error: "Unsupported language!" });
        }
        
        res.json({ filePath, inputPath, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || error });
    }
});

app.listen(8000, () => {
    console.log("Server is listening on port 8000!");
});
