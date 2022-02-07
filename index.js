const express = require("express");
const morgan = require("morgan");
const app = express();
const server = require("http").Server(app);
// const port = 9999;
server.listen(process.env.PORT || 9999);
const path = require("path");
const { engine } = require("express-handlebars");

const io = require("socket.io")(server);

var user = ["hao"];

io.on("connect", (socket) => {
    // either with send()
    console.log("có người kết nối: " + socket.id);

    socket.on("disconnect", () => {
        console.log(socket.id + ": Đã ngắt kết nói");
    });

    socket.on("register-user", (data) => {
        if (user.indexOf(data) >= 0) {
            socket.emit("server-send-register-fail");
        } else {
            user.push(data);
            socket.username = data;
            socket.emit("server-send-register-success", data);
            io.sockets.emit("server-list-user-online", user);
        }
    });
    socket.on("logout", function () {
        user.splice(user.indexOf("socker.user"), 1);
        socket.broadcast.emit("server-list-user-online", user);
    });
    socket.on("send-message", function (data) {
        io.sockets.emit("server-send-message", {
            username: socket.username,
            content: data,
        });
    });
    socket.on("client-focusin-message", function (data) {
        socket.broadcast.emit("server-send-user-focusin-message", {
            username: socket.username,
            content: data,
        });
    });
    socket.on("client-focusout-message", function () {
        socket.broadcast.emit("server-send-user-focusout-message");
    });
});
//public file
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//set view handlebars
app.engine("hbs", engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
    res.render("home");
});
