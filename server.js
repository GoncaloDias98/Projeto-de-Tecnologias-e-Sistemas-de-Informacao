const express = require("express");
const app = express();
const chalk = require("chalk");
const Asyncjs = require("async");
app.set('view engine', 'html');


global.inDev = true;
global.rootPath = __dirname;

if (!process.env.PORT)
    process.env.PORT = 8080
if (!process.env.IP)
    process.env.IP = "localhost"

Asyncjs.waterfall([
    require("./server/Init/ModuleAlias"),
    callback => require("./server/Init/Cors")(app, callback),
    callback => require("./server/Init/HeaderReader")(app, callback),
    callback => require("./server/Init/ioReporter")(app, callback),
    require("./server/Init/GlobalVariables"),
    callback => require("./server/Init/Middleware")(app, callback),
    callback => require("./server/Init/Sniffer")(app, callback),
    callback => require("./server/Init/FileReader")(app, callback),
    require("./server/Init/Cron"),
    require("./server/Init/PackageForcer")
], () => {
    app.listen(process.env.PORT || 8080, process.env.IP || "localhost", () => {
        console.log(chalk.green("Server listening on: ") + chalk.red(process.env.IP + ":" + process.env.PORT));
    });
});

app.use('/controller', express.static('controller'));
var routesUser = require('./controller/index.route.js');


app.get('/', (req, res)=>{
    res.sendFile('index.html', { root: './public' });
})
