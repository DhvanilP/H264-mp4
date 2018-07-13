const express = require('express');
const fs = require('fs');
const hbjs = require('handbrake-js');
const https = require('https');
var bodyParser = require('body-parser');
// var ffmpeg = require('ffmpeg');
var ffmpeg = require('fluent-ffmpeg');


const app = express();

app.set('port', 8080);
app.use(bodyParser.urlencoded({extended: true}));

// app.listen(app.get('port'), function () {
//     console.log("server up")
// });

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post("/myaction", function (req, res) {
    console.log("Got a post req:" + req.body.videoname);
    var input = req.body.videoname;
    console.log("inside the function to covert the video:" + input);
    var temp = input.split('.');
    var filename = temp[0] + '.mp4';
    var file = fs.createWriteStream('./videos/' + input);
    var request = https.get("https://s3.ap-south-1.amazonaws.com/lightmetrics/" + input, function (response) {
        response.pipe(file);
        console.log("file stored locally");
        // ffmpeg().input('./videos/' + input).complexFilter([{
        //     filter: 'setpts',
        //     options: '2.5*PTS',
        //     outputs: 'intermediate'
        // }, {
        //     filter: 'rotate',
        //     options: '1*PI',
        //     inputs: 'intermediate',
        //     outputs: 'output'
        // }], 'output').save('./videos/' + filename).on('end', function (stdout, stderr) {
        //     console.log("completed\ndeleting the h264 file");
        //     fs.unlink('./videos/' + input, some => {
        //         console.log("deleted the file:" + input);
        //         var filePath = "./videos/" + filename;
        //         var stat = fs.statSync(filePath);
        //         res.writeHeader(200, {
        //             'Content-Type': 'video/mp4',
        //             'Content-Length': stat.size
        //         });
        //         console.log(stat.size);
        //         var readStream = fs.createReadStream(filePath);
        //         // We replaced all the event handlers with a simple call to readStream.pipe()
        //         readStream.pipe(res);
        //     });
        // });

    });
});

app.post("/myaction2", function (req, res) {
    console.log("Got a post req:" + req.body.videoname);
    var input = req.body.videoname;
    console.log("inside the function to covert the video:" + input);
    var temp = input.split('.');
    var filename = temp[0] + '.mp4';
    var file = fs.createWriteStream('./videos/' + input);
    var request = https.get("https://s3.ap-south-1.amazonaws.com/lightmetrics/" + input, function (response) {
        response.pipe(file);
        console.log("file stored locally");
        ffmpeg().input('./videos/' + input).complexFilter([{
            filter: 'setpts',
            options: '2.5*PTS',
            outputs: 'intermediate'
        }, {
            filter: 'rotate',
            options: '1*PI',
            inputs: 'intermediate',
            outputs: 'output'
        }], 'output').save('./videos/' + filename).on('end', function (stdout, stderr) {
            console.log("completed\ndeleting the h264 file");
            fs.unlink('./videos/' + input, some => {
                console.log("deleted the file:" + input);
                res.download('./videos/' + filename);
                // var filePath = "./videos/" + filename;
                // var stat = fs.statSync(filePath);
                // res.writeHeader(200, {
                //     'Content-Type': 'video/mp4',
                //     'Content-Length': stat.size,
                //     'Content-Disposition': 'attachment; filename=' + filename
                // });
                //
                // var readStream = fs.createReadStream(filePath);
                // readStream.pipe(res);

            });
        });
    });
});


////////////////////////////////////////////////////////////////

// ffmpeg().input('./videos/sample.h264').complexFilter([{
//     filter: 'setpts',
//     options: '2*PTS',
//     outputs: 'intermediate'
// }, {
//     filter: 'rotate',
//     options: '1*PI',
//     inputs: 'intermediate',
//     outputs: 'output'
// }], 'output').save('cool.mp4').on('end', function () {
//     console.log("DONE :)");
// });

//// ------------Take screenshots-------------
// ffmpeg().input('./cool.mp4').screenshots({
//     folder:'./videos',
//     count:6
// });

//// ------------Generate a yuv file-------------
// ffmpeg().input('./cool.mp4').save('out.yuv').on('end', function () {
//     console.log("Done2 :)")
// });