const { default: axios } = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const FormData = require('form-data');
const fetch = require('node-fetch');
const { response } = require("express");
const download = require('image-downloader')

const texturelab_url = "https://texturelabs.org/";
/**
find all category
return
@returns title
@returns img : image thumbnail
@return link : links
 */
async function fetchTLabCategory() {
    return new Promise((resolve, reject) => {


        axios.get(texturelab_url).then(res => {
            const $ = cheerio.load(res.data);
            let result = [];
            $(".cat-single").each((id, el) => {
                const title = $(el).find(".text").text().trim();
                const img = $(el).find("img").attr("src");
                const link = $(el).find("a").attr("href");
                result.push({ "title": title, "img": img, "link": link })
            });

            resolve(result);
        })
    })
}

/* async fetch all url
@params urls
@return array result;
*/
async function fetchAllUrls(urls) {
    var result = []
    await Promise.all(urls.map(async (url) => {

        await axios.get(url).catch(function (error) {
            console.log(error.toJSON());
        }).then(async (res) => {
            try {
                const $ = cheerio.load(res.data);
                const cards = $(".card-home");
                $(cards).each((id, el) => {
                    const thumbnail = $(el).find(".product_thumb").attr("src");
                    const image = $(el).find(".zoom_product_thumbnail").attr("href");
                    result.push({ "thumb": thumbnail, "image": image })
                })
            } catch (error) {

            }

        })

    }))
    return result;
}

async function fetchTLab(url) {
    return new Promise((resolve, rej) => {
        let result = []
        axios.get(texturelab_url + url).catch(function (error) {

        }).then(async (res) => {
            const $ = cheerio.load(res.data);
            const page = $(".pagination").find("a");
            let urls = [texturelab_url + url];
            $(page).each(async (i, e) => {
                urls.push($(e).attr("href"));

            })
            resolve(await fetchAllUrls(urls))
        })

    })

}
function checkdir(foldername) {
    const dir = path.dirname(__dirname) + "\\public\\repo\\" + foldername;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}
function checkFile(filepath) {
    return fs.existsSync(filepath);
}

function downloadImage(imageurl, dirname, filename) {

    const options = {
        url: imageurl,
        dest: dirname               // will be saved to /path/to/dest/image.jpg
    }

    download.image(options)
        .then(({ filename }) => {
            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err))
}

router.get("/list/:key",(req,res)=>{
    const result = "yes"
    const datas = fs.readFileSync(path.dirname(__dirname)+"\\public\\texturelab.json");
    const json = JSON.parse(datas);
    res.json({ status: 200, message: json })
    //res.render('index', { title: 'TextureLabs', message: JSON.stringify(json,false,2)})
})

router.get("/:key", async (req, res) => {
    try {

        if (req.params["key"] == "cat") {
            const thumbdir = checkdir("thumbs");
            const cate = await fetchTLabCategory();
            let all_data = []
            await Promise.all(cate.map(async (cat) => {

                const url = new URL(cat.img);
                const filename = path.basename(url.pathname);
                checkdir(cat.title.replace("/", "-"))

                await fetchTLab(cat.link).then((result) => {
                    if (result.length > 0) {
                        all_data.push({ title: cat.title.replace("/", "-"), data: result });
                    }
                });

                //downloadImage(c.img,thumbdir,c.title)



            }))



            res.render('index', { title: 'TextureLabs', message: JSON.stringify(all_data) })
        } else if (req.params["key"] == "download") {
            const json = JSON.parse(fs.readFileSync(path.dirname(__dirname) + "\\tes.json"));
            json.forEach((js) => {
                const title = js.title;
                const data = js.data;
                data.forEach((d) => {
                    const url = new URL(d.image);
                    const filename = path.basename(url.pathname);
                    const _filename = (filename.split('.')[0]);

                    downloadImage(d.image, checkdir(title), _filename);
                })
            })



            res.render('index', { title: 'TextureLabs', message: json })

        }else{
            res.json({status:200,message:"hmm"})
        }

        //  res.render('index', { title: 'xx', message: JSON.stringify( await fetchTLab("?ct=19"),null,2)  })



    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify("Something went wrong :("));
    }

});
router.get("/:key", (req, res) => {
    res.json({ status: 200, message: "xx" })
})

module.exports = router;