const ws = new WebSocket('ws://127.0.0.1:8000');

const getPageMessagesFromDb = (page) => ws.send(JSON.stringify({event: 'getPageMessage', payload: {page}}));
const connection = (token) => ws.send(JSON.stringify({event: 'connection', payload: {token}}));
const disconnection = () => ws.send(JSON.stringify({
    event: 'disconnection',
    payload: {id: userId, name: userName}
}));
const exit = () => ws.send(JSON.stringify({
    event: 'exit',
    payload: {id: userId, name: userName}
}));

let chat = $('#chat');
let users = $('#users');
let input = $('#input');
let token = localStorage.getItem('jwt');

let userName;
let userId;

ws.onopen = () => {

    if (!token) {
        ws.close();
        document.location.href = '/'
        return;
    }

    $.ajax({
        url: 'http://users.api.loc/auth',
        type: 'POST',
        dataType: 'json',
        data: {
            token: token
        },
        success(data) {
            userId = data.id;
            userName = data.firstname;

            users.append('<p>' + `Ваше имя: ${userName}` + '</p>');
            users.scrollTop(users.prop('scrollHeight'));

            connection(token);
        }
    });
};

ws.onmessage = (message) => {
    const messages = JSON.parse(message.data);
    if (!messages || !messages.event || !messages.payload) return;

    switch (messages.event) {

        case 'message': {
            console.log(messages.payload.message);
            let name = messages.payload.name;
            let message = messages.payload.message;
            if (!name || !message) return;

            chat.append('<p>' + name + ':' + message + '</p>');
            chat.scrollTop(chat.prop('scrollHeight'));
        }
            break;

        case 'infoMessage': {
            const name = messages.payload.name;
            const message = messages.payload.message;
            if (!name || !message) return;

            printInfoMessage(name + ' ' + message);
        }
            break;

        case 'sendOnlineList': {
            let onlineUsers = messages.payload.onlineName;
            if (!onlineUsers) return;

            while (users.firstChild) {
                users.removeChild(users.firstChild);
            }

            onlineUsers.forEach(function (user) {
                users.append('<p>' + user + '</p>');
                users.scrollTop(users.prop('scrollHeight'));
            });
            break;
        }

        case 'loadingFirstPage': {
                const userMessages = messages.payload.results;
                if (!userMessages) return;

                userMessages.forEach(function (userMessage) {
                    const name = userMessage.name;
                    const message = userMessage.message;
                    printPageMessage(name, message);
                });
            }
            break;

        case 'loadingPage': {
            const userMessages = messages.payload.results;
            if (!userMessages) return;

            userMessages.forEach(function (userMessage) {
                const name = userMessage.name;
                const message = userMessage.message;
                printMessageScrolling(name, message);
            });
        }
            break;
        }
}

input.keydown(function (e) {
    if (e.keyCode === 13) {
        let message = $(this).val();
        if (!message) {
            return;
        }
        ws.send(JSON.stringify({
            event: 'message',
            payload: {
                name: userName,
                message: message
            }
        }));
        $(this).val('');
    }
});

$('button[id = "logout"]').click(function () {
    exit();
    localStorage.clear();
    document.location.href = '/';
});

function printInfoMessage(message) {
    chat.append('<p>' + message + '</p>');
    chat.scrollTop(chat.prop('scrollHeight'));
}

function printPageMessage(name, message) {
    chat.prepend('<p>' + name + ':' + message + '</p>');
    chat.scrollTop(chat.prop('scrollHeight'));
}

function printMessageScrolling(name, message) {
    chat.prepend('<p>' + name + ':' + message + '</p>');
    chat.insertBefore(chat.prop('scrollTop'));
}

let page = 2;

chat.addEventListener('scroll', event => {
    if (chat.scrollTop < 100) {
        getPageMessagesFromDb(page++);
    }
});