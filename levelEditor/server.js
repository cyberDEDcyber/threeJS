var http = require("http");
var fs = require("fs");
var qs = require("querystring")

//TABLICA LEVELI
var allLevel = [];

function servResponse(req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data;
    })
    req.on("end", function (data) {
        var finish = qs.parse(allData);

        //DODANIE POZIOMU
        if (finish.action == "DODAJ_POZIOM") {
            allLevel.push(finish.board);
            var il = allLevel.length;
            //, null, 5
            res.end(JSON.stringify(il));
        }

        //WCZYTANIE POZIOMU
        else if (finish.action == "WCZYTAJ") {
            var obj = allLevel[finish.level];
            res.end(obj);
        }

        //ZMIANA LEVELA/EDYCJA
        else if (finish.action == "EDYTUJ") {
            allLevel[finish.index] = finish.board;
            res.end();
        }

        //WCZYTANIE ILOSCI LEVELI
        else if (finish.action == "SHOW") {
            var il = allLevel.length;
            res.end(JSON.stringify(il));
        }
    })
}

//SERWER
var server = http.createServer(function (req, res) {
    switch (req.method) {

        //GET
        case "GET":
            if (req.url == "/") {
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".html") != -1) {
                fs.readFile("static" + req.url, function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".css") != -1) {
                fs.readFile("static" + req.url, function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".js") != -1) {
                fs.readFile("static" + req.url, function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".jpg") != -1) {
                fs.readFile("static" + req.url, function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".mp3") != -1) {
                fs.readFile("static/mp3/" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "audio/mpeg" });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url.indexOf(".png") != -1) {
                fs.readFile("static" + decodeURI(req.url), function (error, data) {
                    res.writeHead(200, { "Content-type": "image/png" });
                    res.write(data);
                    res.end();
                })
            }
            break;

        //POST
        case "POST":
            servResponse(req, res)
            break;
        default: break;
    }
})

//PORT
server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
