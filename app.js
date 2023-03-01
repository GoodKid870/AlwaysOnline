//--Библиотеки npm --//
import express from "express"
import session from "express-session"
import path from "path"
const app = express();
import http from 'http';
import multer from "multer"
const upload = multer({ dest: 'uploads/users/avatars' })
import { fileURLToPath } from 'url';
const server = http.createServer(app);
const urlencodedParser = express.urlencoded({extended: true});
import {WebSocketServer} from "ws";
//--Библиотеки npm --//

//--Всякие функции--//
import registration from "./server/registrationFunction/registration.js";
import authorize from "./server/loginFunction/login.js";
import createNews from "./server/createNewsFunction/createNews.js";
import showNews from "./server/showNewsFunction/showNews.js";
import userAvatar from "./server/avatarFunction/avatarFunction.js";
import addFriend from "./server/addFriendFunction/addFriend.js";
import showFriends from "./server/showAddedFriends/showFriends.js";
import userSetting from "./server/userSettingFunction/userSetting.js";
import messagesPartOne from "./server/messagesFunction/messagesPartOne.js";
import deleteFriend from "./server/deleteFriendFunction/deleteFriend.js";
//--Всякие функции--//

//--Работа с хранилищем--//
import {userRepository} from "./server/repository/userRepository.js";
import {database} from "./server/repository/database.js";
import {messageRepository} from "./server/repository/messageRepository.js";
import {friendsRepository} from "./server/repository/friendsRepository.js";
//--Работа с хранилищем--//

//--Директории--//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//--Директории--//

//--Ставим движок, используем наши директории в статике--//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//--Ставим движок, используем наши директории в статике--//

//настройка middleware
app.use(express.json())
const sessionParser = session({
    secret: 'thisismysecretdonttellanyone!',
    cookie: {sameSite: 'strict'},
    saveUninitialized: false,
    resave: false
})
app.use(sessionParser);

function onSocketError(err) {
    console.error(err);
}
//настройка middleware

//------Тут происходят GET моменты------//

// индексируем нашу основную пэйдж
app.get('/', (req, res)  => {
    if (req.session.authorized == true){
        res.redirect("profile")
    } else {
        res.render('pages/Index');
    }
})
// тут берем нашу пэйдж логин
app.get('/login', (req, res) => {
    res.render("pages/Login")
})
// тут берем нашу пэйдж регистрации
app.get('/registration', (req, res) => {
    res.render('pages/Registration')
})
// тут берем нашу пэйдж регистрации
app.get('/settings', async (req, res) => {
    try {
        if (req.session.authorized == true){
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            res.render("pages/Settings", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar})
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})
// тут берем нашу пэйдж создание новости
app.get('/news', async (req, res) => {
    await showNews(req, res)
})
// тут берем нашу пэйдж создание постов
app.get('/create', async (req, res) => {
    try {
        if (req.session.authorized == true){
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            res.render("pages/CreatePost", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar})
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})

// тут берем нашу пэйдж профиль
app.get(`/profile`, async (req, res) => {
    try {
        if (req.session.authorized == true){
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            const statistic = userRepository.userStatisticCounter(user.userInfo.userMail)
            if (user.unreadMessages != undefined){
                const sum = Object.values(user.unreadMessages).reduce((acc, val) => acc + val, 0);
                res.render("pages/Profile", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, statisticPosts: statistic.postUser, statisticFriends: statistic.friendCount, messageCounter: sum})
            } else {
                res.render("pages/Profile", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, statisticPosts: statistic.postUser, statisticFriends: statistic.friendCount, messageCounter: 0})
            }
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})
// тут берем нашу пэйдж выход
app.get("/logout", (req, res) => {
    req.session.destroy()
    res.render("pages/Logout")
})
// тут берем нашу пэйдж друзья
app.get("/myfriends", async (req, res) => {
    await showFriends(req, res)
})

app.get("/messages", async (req, res) => {
    await messagesPartOne(req, res)
})

//тут берем нашу пэйдж друзья
app.get("/addfriend", async (req, res) => {
    try {
        if (req.session.authorized == true){
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            const users = database.getAllDatabaseUsers(user.userInfo.userMail)
            res.render("pages/AllUsers", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, users})
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})

//тут берем нашу пэйдж чат
app.get("/start-chat", (req, res) => {
    try {
        if (req.session.authorized == true) {
            const user = userRepository.getUserFromSession(req.session.usertoken);
            if (user == undefined) {
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            const to = req.query.to;
            // Запрашиваем историю сообщений из "базы" данных
            const messages = messageRepository.getDataBaseMessageList(user.userInfo.userMail);
            if (messages != undefined) {
                const chatId = `chat_${user.userInfo.userId}_${to}`;
                const chatId2 = `chat_${to}_${user.userInfo.userId}`;
                const chats = messages.filter(message => message.chatId === chatId || message.chatId === chatId2).map(message => ({ ...message, direction: message.sender === user.userInfo.userMail ? 'sent' : 'received' }));
                const chaMy = chats.filter(chat => chat.direction == 'sent')
                const chatFrie = chats.filter(chat => chat.direction == 'received')
                const combinedSubArrays = [...chaMy.flatMap(obj => obj.chat), ...chatFrie.flatMap(obj => obj.chat)];
                const sortedMessages = combinedSubArrays.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                res.render("pages/OnlineChat", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, to, chatId: to, userId: user.userInfo.userId, chat: sortedMessages});
            } else {
                res.render("pages/OnlineChat", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, to, chatId: to, userId: user.userInfo.userId, chat: []});
            }
        } else {
            res.redirect("/login");
        }
    } catch (e) {
        console.error(e);
        res.json({
            status: "fail",
            message: "Sorry, an error occurred"
        });
    }
});


//начинается мясо, так как мы тут используем websocket-server, но не просто, а так, чтобы получить сессию
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

//используем мапы для коннектов и пар юзеров
const connections = new Map();
const connectedPairs = new Map();

//основная логика коннектов, передачи сообщений и присоеденения к комнатам
server.on('upgrade', (request, socket, head) => {
    socket.on('error', onSocketError);

    //гоняем сесси наших подключенных клиентов
    sessionParser(request, {}, () => {
        if (!request.session.userId) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        socket.removeListener('error', onSocketError);
        //если все отлично, передаем все параметры и в бой
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
});

//если все гуд, идем к коннекту
wss.on('connection', (ws, request) => {
    //из сессии получаем id юзера
    const userId = request.session.userId;
    const user = userRepository.getUserFromSession(request.session.usertoken)
    //ставим ее коннекту
    connections.set(userId, ws);
    ws.on('error', console.error);

    // тут идем к сообщениям
    ws.on('message', function (message) {
        const data = JSON.parse(message);
        const senderId = userId;
        const recipientId = data.recipientId;
        const content = data.content;
        const ava = data.avatar
        const senderName = data.senderName
        const fileName = `chat_${senderId}_${recipientId}`;
        const user = userRepository.getUserFromSession(request.session.usertoken)
        const friend = friendsRepository.getDatabasefriends(recipientId)
        const friendUser = userRepository.getUserFromEmail(friend.friends.usermail);
        let chatHistory = {
            chat: [],
            chatId: fileName,
            sender: user.userInfo.userMail,
            receiver: friendUser.userInfo.userMail
        };
        //определяем получателя, и кайфуем
        const recipient = connections.get(recipientId);
        if (recipient) {
            recipient.send(JSON.stringify({
                senderId: senderId,
                content: content,
                avatar: ava,
                senderName: senderName,
                chatId: `${fileName}`,
                timestamp: new Date()
            }));
        }

        if (friendUser.unreadMessages) {
            friendUser.unreadMessages[recipientId] = friendUser.unreadMessages[recipientId] ? friendUser.unreadMessages[recipientId] + 1 : 1;
        } else {
            friendUser.unreadMessages = {};
            friendUser.unreadMessages[recipientId] = 1;
        }
        chatHistory.chat.push(data);
        database.setDatabaseObject("users", friendUser.userInfo.userMail, friendUser)
        messageRepository.addUserMessage(fileName, chatHistory, user.userInfo.userMail, recipientId)
        // Сохраняем пару пользователей, которые подключены друг к другу
        const pairKey = [senderId, recipientId].sort().join('-');
        connectedPairs.set(pairKey, true);
    });

    ws.on('close', function () {
        connections.delete(userId);

        // Удаляем пару из карты подключенных пар
        connectedPairs.forEach((value, pairKey) => {
            if (pairKey.includes(userId)) {
                connectedPairs.delete(pairKey);
            }
        });
    });

    // Отправляем все предыдущие сообщения пользователю, если они являются частью подключенной пары
    connections.forEach( (connection, otherUserId) => {
        if (otherUserId !== userId) {
            const pairKey = [userId, otherUserId].sort().join('-');
            if (connectedPairs.get(pairKey)) {
                connection.send(JSON.stringify({
                    senderId: otherUserId,
                    content: `Пользователь ${userId} подключился к чату`,
                }));
            }
        }
    });
});



// берем нашу пэйдж настройки
app.get("/usersetting", async (req, res) => {
    try {
        if (req.session.authorized == true){
            const user = userRepository.getUserFromSession(req.session.usertoken)
            if (user == undefined){
                return res.json({
                    status: "sessionFail",
                    message: "Нужна повторная авторизация"
                })
            }
            res.render("pages/SettingData", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar})
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})



//--Здесь происходят POST моменты --//

//POST моменты регистрация
app.post("/registration", urlencodedParser, async (request, response) => {
    try {
        await registration(request, response)
    } catch (e) {
        console.log(e)
    }
});

//POST моменты авторизация
app.post('/login', urlencodedParser, async (req, res) => {
    try {
        if (!req.body) return res.sendStatus(400);
        await authorize(req, res)
    } catch (e) {

    }
})

//POST моменты новости
app.post("/news", urlencodedParser, async (req, res) => {
    try {
        await createNews(req, res)
    }
    catch (e) {
        console.log(e)
    }
})

//POST моменты настройки
app.post('/settings', upload.single('avatar'), urlencodedParser, async (req, res) => {
    try {
        if (!req.file) return res.sendStatus(400)
        await userAvatar(req, res)
    }
    catch (e) {
        console.log(e)
    }
})

app.post("/usersetting", urlencodedParser, async (req, res) => {
    try {
        await userSetting(req, res)
    } catch (e) {
        console.log(e)
    }
})

app.post('/addfriend', async (req, res) => {
    try {
        await addFriend(req, res)
    } catch (err) {
        console.error(err);
    }
});

app.post("/myfriends", async (req, res) => {
    try {
        await deleteFriend(req, res)
    } catch (e) {
        console.log(e)
    }
})




//запуск нашего чуда
server.listen(8080, () => {
    console.log(`Server started at http://localhost:${8080}`);
});