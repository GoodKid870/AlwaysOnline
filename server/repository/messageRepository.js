//импортируем репозитории
import {database} from "./database.js";
import {userRepository} from "./userRepository.js";
import {friendsRepository} from "./friendsRepository.js";



//репозиторий для работы с сообщениями
export const messageRepository = {
    getDatabaseMessage(id) {
        try {
            const mails = database.getDatabaseMessageObject("messages", id)
            return mails
        } catch (e) {
            return undefined
        }
    },


    //возвращает массив сообщений, для определенного пользователя
    getDataBaseMessageList(usermail){
        const user = userRepository.getUserFromEmail(usermail)
        const mail = []
        if (user != undefined && 'mail' in user){
            for (const chatId of user.mail){
                const mails = messageRepository.getDatabaseMessage(chatId.chatId)
                if (mails != undefined){
                    mail.push(mails)
                }
            }
        }
        return mail
    },

    //при написании сообщения, от кого-то к кому-то названия файла с сообщением пушиться и другу и пользователю
    addUserMessage(filename, message, userMail, friendId) {
        try {
            const user = userRepository.getUserFromEmail(userMail);
            const friend = friendsRepository.getDatabasefriends(friendId);
            const friendUser = userRepository.getUserFromEmail(friend.friends.usermail);
            if (!user.mail || user.mail.length === 0 || !friendUser.mail || friendUser.mail.length === 0) {
                user.mail = user.mail || [];
                friendUser.mail = friendUser.mail || [];
                user.mail.push({ chatId: filename });
                friendUser.mail.push({ chatId: filename });
            } else if (!user.mail.find(chat => chat.chatId === filename) && !friendUser.mail.find(chat => chat.chatId === filename)) {
                user.mail = user.mail || [];
                user.mail.push({ chatId: filename });
                friendUser.mail = friendUser.mail || [];
                friendUser.mail.push({ chatId: filename });
            }
            database.setDatabaseObject("users", userMail, user);
            database.setDatabaseObject("users", friendUser.userInfo.userMail, friendUser);
            const dataChat = database.getDatabaseMessageObject("messages", filename);
            if (dataChat) {
                dataChat.chat.push(message.chat[0]);
                database.setDatabaseMessageObjects("messages", filename, dataChat);
            } else {
                database.setDatabaseMessageObjects("messages", filename, message);
            }
        } catch (e) {
            console.log(e);
        }
    },

    //если пользователь решил поменять логин или почту, то эти данные меняются в сообщениях
    changeUserMessageData(usermail, username, newusername) {
        try {
            const user = userRepository.getUserFromEmail(usermail);
            if (user != undefined && 'mail' in user) {
                for (const chatId of user.mail) {
                    const messages = messageRepository.getDatabaseMessage(chatId.chatId);
                    if (messages != undefined){
                        if (messages.receiver != usermail){
                            messages.sender = usermail
                        }
                        for (const message of messages.chat) {
                            if (message.senderName === username) {
                                message.senderName = newusername;
                            }
                        }
                        database.setDatabaseObject("messages", chatId.chatId, messages);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },

    changeUserMessageAvatar(usermail, username, avatar){
        try {
            const user = userRepository.getUserFromEmail(usermail);
            if (user != undefined && 'mail' in user) {
                for (const chatId of user.mail) {
                    const messages = messageRepository.getDatabaseMessage(chatId.chatId);
                    if (messages != undefined){
                        for (const message of messages.chat) {
                            if (message.senderName === username) {
                                message.avatar = avatar;
                            }
                        }
                        database.setDatabaseObject("messages", chatId.chatId, messages);
                    }
                }
            }
        } catch (e) {

        }
    }
}