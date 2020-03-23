var http = require('http');
var tts = require('./speech.js');

var appt = 'Your appointment will be in ';
var cntdwn = '5 minutes.';

http.createServer(function (request, response) {
  tts.speech({
    key: '7c94d8a1aad74328bec5315298f927c2',
    hl: 'en-us',
    src: appt + cntdwn,
    r: -1,
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false,
    b64: false,
    callback: function (error, content) {
      response.end(error || content);
    }
  });
}).listen(8081);