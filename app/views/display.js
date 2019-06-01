const terminalImage = require('terminal-image');
const got = require('got');

async function displayUrlImage(imgUrl){
        const {body} = await got(imgUrl, {encoding: null});
        console.log(await terminalImage.buffer(body));
        return true;
}

async function displayStaticImage(path){
    console.log(await terminalImage.file(path));
}


module.exports = {
    displayUrlImage,
    displayStaticImage
}