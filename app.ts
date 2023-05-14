//--NPM Libraries--//
import express from "express";
import session from "express-session";
import path from 'path';
import { createServer } from 'http';
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import multer from 'multer';
import { WebSocket } from 'ws';
const upload = multer({ dest: 'uploads/users/avatars' })
import type { Response } from 'express';
//--NPM Libraries--//

//--Functions--//
import PostNewsHandler from './server/Handlers/PostNewsHandler';
import MessageHandler from "./server/Handlers/MessageHandler";
import FriendsHandler from "./server/Handlers/FriendsHandler";
import UserProfileHandler from "./server/Handlers/UserProfileHandler";
import loginAndRegistrationHandler from "./server/Handlers/LoginAndRegistrationHandler";
//--Functions--//

//--Repository--//
import CustomRequest from "./server/Repository/Interfaces/CustomRequest";
import UserRepository from "./server/Repository/UserRepository";
import Database from "./server/Repository/Database";
import MessageRepository from "./server/Repository/MessageRepository";
import FriendsRepository from "./server/Repository/FriendsRepository";
import webManager from "./server/Repository/WebManager";
import {CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER} from "./server/Repository/Interfaces/ErrorResponsList";
//--Repository--//


//--View engine setup and setup our app--//
const app = express();
const server = createServer(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//--View engine setup and setup our app--//

//--Middleware setup--//
app.use(express.json());
const sessionParser = session({
    secret: 'thisismysecretdonttellanyone!',
    cookie: {sameSite: 'strict'},
    saveUninitialized: false,
    resave: false
});
app.use(sessionParser);
app.use(bodyParser.json());
//--Middleware setup--//


//-------GET Requests--------//

// Render our index page
app.get('/', (req: CustomRequest, res: Response)  => {
    if (req.session.authorized == true){
        res.redirect("profile")
    } else {
        res.render('pages/Index');
    }
});

// Render our login page
app.get('/login', (req: CustomRequest, res: Response) => {
    res.render("pages/Login");
});

// Render our registration page
app.get('/registration', (req: CustomRequest, res: Response) => {
    res.render('pages/Registration');
});

// Render our settings page
app.get('/settings', async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true){
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            res.render("pages/Settings", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar});
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        console.log(e);
    }
});
// тут берем нашу пэйдж создание новости
app.get('/news', async (req: CustomRequest, res: Response) => {
    await PostNewsHandler.ShowNews(req, res)
})
// тут берем нашу пэйдж создание постов
app.get('/create', async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true){
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
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
app.get(`/profile`, async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true){
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            const statistic = UserRepository.UserStatisticCounter(user.userInfo.userMail)
            if (user.unreadMessages != undefined){
                const sum = Object.values(user.unreadMessages).reduce((acc: number, val: unknown) => acc + Number(val), 0);
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
app.get("/logout", (req: CustomRequest, res: Response) => {
    req.session.destroy()
    res.render("pages/Logout")
})
// тут берем нашу пэйдж друзья
app.get("/myfriends", async (req: CustomRequest, res: Response) => {
    await FriendsHandler.ShowFriends(req, res)
})

app.get("/messages", async (req: CustomRequest, res: Response) => {
    await MessageHandler.RenderAndReadMessage(req, res)
})

//тут берем нашу пэйдж друзья
app.get("/addfriend", async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true){
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            const users = Database.GetAllDatabaseUsers(user.userInfo.userMail)
            res.render("pages/AllUsers", {mail: user.userInfo.userMail, login: user.userInfo.userLogin, avatar: user.avatar, users})
        } else {
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})

//тут берем нашу пэйдж чат
app.get("/start-chat", (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true) {
            const user = UserRepository.GetUserFromSession(req.session.usertoken);
            if (user == undefined) {
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
            }
            const to = req.query.to;
            // Запрашиваем историю сообщений из "базы" данных
            const messages = MessageRepository.GetDataBaseMessageList(user.userInfo.userMail);
            if (messages != undefined) {
                const chatId = `chat_${user.userInfo.userId}_${to}`;
                const chatId2 = `chat_${to}_${user.userInfo.userId}`;
                const chats = messages.filter(message => message.chatId == chatId || message.chatId == chatId2).map(message => ({ ...message, direction: message.sender == user.userInfo.userMail ? 'sent' : 'received' }));
                const chaMy = chats.filter(chat => chat.direction == 'sent')
                const chatFriend = chats.filter(chat => chat.direction == 'received')
                const combinedSubArrays = [...chaMy.flatMap(obj => obj.chat), ...chatFriend.flatMap(obj => obj.chat)];
                const sortedMessages = combinedSubArrays.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
const connections: Map<number, WebSocket> = new Map();
const connectedPairs: Map<string, boolean> = new Map();
function onSocketError(err: any) {
    console.error(err);
}

//основная логика коннектов, передачи сообщений и присоединения к комнатам
server.on('upgrade', (request: CustomRequest, socket, head) => {
    socket.on('error', onSocketError);

    //гоняем сессии наших подключенных клиентов
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
wss.on('connection', (ws: WebSocket, request: CustomRequest) => {
    //из сессии получаем id юзера
    const userId = request.session.userId;
    //ставим ее коннекту
    connections.set(userId, ws);
    ws.addEventListener('error', console.error);

    // тут идем к сообщениям
    ws.addEventListener('message', (message) => {
        const data = JSON.parse(message.data);
        const senderId = userId;
        const recipientId = data.recipientId;
        const content = data.content;
        const ava = data.avatar
        const senderName = data.senderName
        const fileName = `chat_${senderId}_${recipientId}`;
        const user = UserRepository.GetUserFromSession(request.session.usertoken)
        const friend = FriendsRepository.GetDatabasefriends(recipientId)
        const friendUser = UserRepository.GetUserFromEmail(friend.friends.usermail);
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
        Database.SetDatabaseObject("users", friendUser.userInfo.userMail, friendUser)
        MessageRepository.AddUserMessage(fileName, chatHistory, user.userInfo.userMail, recipientId)
        // Сохраняем пару пользователей, которые подключены друг к другу
        const pairKey = [senderId, recipientId].sort().join('-');
        connectedPairs.set(pairKey, true);
    });

    ws.addEventListener('close', () => {
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
app.get("/usersetting", async (req: CustomRequest, res: Response) => {
    try {
        if (req.session.authorized == true){
            const user = UserRepository.GetUserFromSession(req.session.usertoken)
            if (user == undefined){
                webManager.SendErrorResponse(CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER, res);
                return;
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
app.post("/registration", async (req: CustomRequest, res: Response) => {
    try {
        await loginAndRegistrationHandler.UserRegistration(req, res)
    } catch (e) {
        console.log(e)
    }
});

//POST моменты авторизация
app.post('/login', async (req: CustomRequest, res: Response) => {
    try {
        await loginAndRegistrationHandler.UserAuthorized(req, res)
    } catch (e) {

    }
})

//POST моменты новости
app.post("/news", async (req: CustomRequest, res: Response) => {
    try {
        await PostNewsHandler.CreateNews(req, res)
    }
    catch (e) {
        console.log(e)
    }
})

//POST моменты настройки
app.post('/settings', upload.single('avatar'), async (req: CustomRequest, res: Response) => {
    try {
        await UserProfileHandler.ChangeUserAvatar(req, res)
    }
    catch (e) {
        console.log(e)
    }
})

app.post("/usersetting", async (req: CustomRequest, res: Response) => {
    try {
        await UserProfileHandler.ChangeUserNameData(req, res)
    } catch (e) {
        console.log(e)
    }
})

app.post('/addfriend', async (req: CustomRequest, res: Response) => {
    try {
        await FriendsHandler.AddFriend(req, res)
    } catch (err) {
        console.error(err);
    }
});

app.post("/myfriends", async (req: CustomRequest, res: Response) => {
    try {
        await FriendsHandler.DeleteFriend(req, res)
    } catch (e) {
        console.log(e)
    }
})

//запуск нашего чуда
server.listen(8080, () => {
    console.log(`Server started at http://localhost:${8080}`);
});