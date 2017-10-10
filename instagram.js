const request = require('request');
const fs = require("fs");

const PREFIX = 'https://www.instagram.com/graphql/query/?query_id=17875800862117404&variables=%7B%22tag_name%22%3A%22indiacricketteam%22%2C%22first%22%3A11%2C%22after%22%3A%22';
const CURSOR = 'J0HWdvA2QAAAF0HWXTNcQAAAFvYCAA';
const URL = PREFIX + CURSOR + '%22%7D';

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function recurGetPhoto(nextUrl, last_succ_cursor) {
    request.get({
        url: nextUrl,
        headers: {
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
            'cookie':'mid=WZEWQgAEAAExbqjx86vrCMQxeRpA; fbm_124024574287414=base_domain=.instagram.com; ig_dau_dismiss=1504170569415; sessionid=IGSC78c640e5fc0d8650069e1f3d067fde3570e8eb7c604a404f4523ec4e674bc7ad%3AdxeLc95tRZ7zh8cov717dYSamIldvOCq%3A%7B%22_auth_user_id%22%3A5877967271%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_token_ver%22%3A2%2C%22_token%22%3A%225877967271%3Aq3kJRjNMLhpCOrsscLevrzGnMO61wuY2%3A8cf74081439727fac3f6e87c337d779c36422c036a1bac19c233ffbcdd46763d%22%2C%22_platform%22%3A4%2C%22last_refreshed%22%3A1507534088.3159253597%2C%22asns%22%3A%7B%22time%22%3A1505699938%2C%2245.255.126.42%22%3A135391%7D%7D; ig_vw=675; ig_pr=1; ig_vh=965; csrftoken=E4ugmO5Y4Gcowx8333AX61yvdbHEdxH2; rur=FTW; ds_user_id=5877967271; urlgen="{\"time\": 1507534086\054 \"8.37.228.187\": 54994\054 \"8.37.228.189\": 54994\054 \"36.66.109.66\": 17974}:1e1lfo:rKAkEJTj13gT7wmbPF0y1f9dn24"'
        }
    }, function(err,res,body) {
        var obj = JSON.parse(body);
        try {
            var cursor = obj.data.hashtag.edge_hashtag_to_media.page_info.end_cursor.split("%")[0];
            console.log(cursor);
            var array = obj.data.hashtag.edge_hashtag_to_media.edges;
            array.forEach(function(element) {
                var tmp = element.node.display_url;
                var photo_name = 'indiacricketteam/'+tmp.split("/").pop();
                // console.log(element.node.edge_media_to_caption.edges[0].node.text);
                download(tmp, photo_name, function(){
                    console.log(photo_name);
                });
                fs.writeFile(photo_name+'.txt', element.node.edge_media_to_caption.edges[0].node.text, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    // console.log("The file was saved!");
                }); 
            }, this);
            var tmpUrl = PREFIX + cursor + '%22%7D';
            
            setTimeout(function() {
                recurGetPhoto(tmpUrl, cursor)} , 5000);

        } catch(e) {
            console.log(obj);
            var url = PREFIX + cursor + '%22%7D';
            setTimeout(function() {
                recurGetPhoto(url, last_succ_cursor)}, 5000);
        }
    });
}

recurGetPhoto(URL, CURSOR);
