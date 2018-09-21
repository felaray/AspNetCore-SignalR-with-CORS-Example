import "./css/main.css";
import * as signalR from "@aspnet/signalr";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");



//呼叫時在js初始化物件
declare function init(): InitData;
//定義型別
class InitData {
    user: string;
    appid: string;
    endpoint: string;
}

var data = init();
var baseUrl = data.endpoint;
var username = data.user == "" ? new Date().getTime() : data.user;
console.log("Welcome " + data.user);

const connection = new signalR.HubConnectionBuilder()
    .withUrl(baseUrl + "/hub")
    .build();

connection.start().catch(err => document.write(err));

connection.on("messageReceived", (username: string, message: string) => {
    let m = document.createElement("div");

    m.innerHTML =
        `<div class="message__author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        send();
    }
});

btnSend.addEventListener("click", send);

function send() {
    connection.send("newMessage", username, tbMessage.value)
        .then(() => tbMessage.value = "");
}
