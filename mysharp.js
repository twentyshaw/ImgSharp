// #!/usr/bin/env node

// const program = require('commander');

// program
//   .version('0.1.0')
//   .option('-i, --input <input path>', 'input path')
//   .option('-o, --output<output path>', 'output path','./output/')
//   .parse(process.argv);

// if (program.yourname) {
//   console.log(`Hello, ${program.input}! ${program.output}`);
// }

const sharp = require('sharp')

let fs = require('fs')

function readFileList(path, filesList) {
    let files = fs.readdirSync(path)
    files.forEach(function (itme, index) {
        let stat = fs.statSync(path + itme)
        if (stat.isDirectory()) {
        //递归读取文件
            readFileList(path + itme + "/", filesList)
        } else {
            let obj = {}
            obj.path = path
            obj.filename = itme
            filesList.push(obj)
        }
    })
    return filesList
}

//遍历所有图片进行压缩
function getImageFiles(path,isCover=false) {
    let imageList = []    
    readFileList(path, imageList).forEach((item) => {
        //选择是否覆盖当前文件
        if (isCover) {
            sharp(item.path+item.filename)
            .jpeg({
                quality: 50
            })
            .toBuffer()
            .then(data => {
                fs.writeFileSync(item.path+item.filename,data,()=>{console.log("success")})
            })
            .catch(err=>{console.log(err)})
        }else{
            let out = item.path.split('/').slice(2).join('/')
            let outpath = './output/' + out
            fs.exists(outpath,function(exists){
                if (!exists) {
                    fs.mkdirSync(outpath,{ recursive: true },function(err){if (err) {console.log(err)}})
                }
                sharp(item.path+item.filename)
                .jpeg({
                    quality: 50
                })
                .toFile(outpath+item.filename)
                .then(info => {console.log(info)})
                .catch(err=>{console.log(err)})
            })
        }
    });

}

//运行脚本
getImageFiles('./public/')

//console.log('Hello world!');