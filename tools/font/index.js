const fs = require('fs');
const path = require('path');
const axios = require('axios');

const jsonData = require("./demo.json").data

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
        let fileContent = `
        export const fonts = [`;
        for (let index = 0;
            // index < 3;
            index < jsonData.length; 
            index++) {
                
            const item = jsonData[index];
            console.log(item.id);

            const fileUrl = item.attributes.file.data.attributes.url;
            console.log('fileUrl: ', fileUrl);
            const imgUrl = item.attributes.img.data.attributes.url;
            console.log('imgUrl: ', imgUrl);
            const fileSavePath = path.join(__dirname, 'downloads', item.attributes.file.data.attributes.name);
            const imgSavePath = path.join(__dirname, 'downloads', item.attributes.img.data.attributes.name);
            try {
                await downloadFile(`https://www.kuaitu.cc/${fileUrl}`, fileSavePath);
                await downloadFile(`https://www.kuaitu.cc/${imgUrl}` , imgSavePath);
                fileContent += `
                {
                    name: '${item.attributes.name}',
                    file: new URL('./${item.attributes.file.data.attributes.name}', import.meta.url).href,
                    img: new URL('./${item.attributes.img.data.attributes.name}', import.meta.url).href
                },
                `
            } catch (error) {
                console.error('Error downloading file:', item.attributes.name);
                if (fs.existsSync(fileSavePath)) {
                    fs.unlinkSync(fileSavePath);
                }
                if (fs.existsSync(imgSavePath)) {
                    fs.unlinkSync(imgSavePath);
                }
            }
        }
        fileContent +=`];`

        fs.writeFile('./downloads/index.ts', fileContent, (err) => {
            if (err) {
            console.error('Error writing file:', err);
            } else {
            console.log(`File created successfully at './downloads/index.ts'`);
            }
        })
    }
)()






