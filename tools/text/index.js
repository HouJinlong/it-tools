const fs = require('fs');
const path = require('path');
const axios = require('axios');

const jsonData = require("./demo.json")

// // 下载文件的函数
const downloadFile = async (url, filePath) => {
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};
(
    async () => {
        const json = []
        for (let index = 0;
            index < jsonData.length; 
            index++) {

            const item = jsonData[index];
            const imgUrl = item.imgUrl;
            const imgSavePath = path.join(__dirname, 'downloads', `${item.name}.png`);
            try {
                await downloadFile(`${imgUrl}`, imgSavePath);
                json.push(
                    {
                        name: item.name,
                        json: item.json,
                        img: `./${item.name}.png`
                    },
                )
            } catch (error) {
                console.error('Error downloading file:', error,item.name,imgUrl);
                if (fs.existsSync(imgSavePath)) {
                    fs.unlinkSync(imgSavePath);
                }
            }
        }

        fs.writeFile('./downloads/index.json', JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`File created successfully at './downloads/index.ts'`);
            }
        })
    }
)()






