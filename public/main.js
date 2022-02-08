var socket = io("http://localhost.com:9999");

socket.on("server-send-register-fail", function () {
    alert("Tên này đã được đăng ký");
});
socket.on("server-send-register-success", function (data) {
    $("#name-user-data").append(data);
    $("#box-login").hide(2000);
    $("#box-chat").show(1000);
});

socket.on("server-list-user-online", function (data) {
    $("#user-online").html("");
    data.forEach(function (i) {
        $("#user-online").append("<div class='user-online'> " + i + "</div>");
    });
});

socket.on("server-send-message", function (data) {
    $("#list-message").append(
        '<div class="msm">' + data.username + " : " + data.content + "</div>"
    );
});

socket.on("server-send-user-focusin-message", function (data) {
    $("#focusin-message").append(data.username + ":" + data.content);
});
socket.on("server-send-user-focusout-message", function () {
    $("#focusin-message").html("");
});
$(document).ready(function () {
    $("#box-login").show();
    $("#box-chat").hide();

    $("#btn-register").click(function () {
        socket.emit("register-user", $("#username").val());
    });
    $("#btn-logout-user").click(function () {
        socket.emit("logout");
        $("#box-login").show(1000);
        $("#box-chat").hide(2000);
    });
    $("#btn-send-message").click(function () {
        socket.emit("send-message", $("#message").val());
    });
    $("#message").focusin(function () {
        socket.emit("client-focusin-message", "Đang soạn tin nhắn");
    });
    $("#message").focusout(function () {
        socket.emit("client-focusout-message");
    });
});
