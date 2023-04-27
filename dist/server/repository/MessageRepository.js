//импортируем репозитории
import FriendsRepository from "./FriendsRepository.js";
import Database from "./Database.js";
import UserRepository from "./UserRepository.js";
class MessageRepository {
    static GetDatabaseMessage(id) {
        try {
            const mails = Database.GetDatabaseMessageObject("messages", id);
            return mails;
        }
        catch (e) {
            return undefined;
        }
    }
    //возвращает массив сообщений, для определенного пользователя
    static GetDataBaseMessageList(usermail) {
        const user = UserRepository.GetUserFromEmail(usermail);
        const mail = [];
        if (user != undefined && 'mail' in user) {
            for (const chatId of user.mail) {
                const mails = MessageRepository.GetDatabaseMessage(chatId.chatId);
                if (mails != undefined) {
                    mail.push(mails);
                }
            }
        }
        return mail;
    }
    //при написании сообщения, от кого-то к кому-то названия файла с сообщением пушиться и другу и пользователю
    static AddUserMessage(filename, message, userMail, friendId) {
        try {
            const user = UserRepository.GetUserFromEmail(userMail);
            const friend = FriendsRepository.GetDatabasefriends(friendId);
            const friendUser = UserRepository.GetUserFromEmail(friend.friends.usermail);
            if (!user.mail || user.mail.length === 0 || !friendUser.mail || friendUser.mail.length === 0) {
                user.mail = user.mail || [];
                friendUser.mail = friendUser.mail || [];
                user.mail.push({ chatId: filename });
                friendUser.mail.push({ chatId: filename });
            }
            else if (!user.mail.find(chat => chat.chatId === filename) && !friendUser.mail.find(chat => chat.chatId === filename)) {
                user.mail = user.mail || [];
                user.mail.push({ chatId: filename });
                friendUser.mail = friendUser.mail || [];
                friendUser.mail.push({ chatId: filename });
            }
            Database.SetDatabaseObject("users", userMail, user);
            Database.SetDatabaseObject("users", friendUser.userInfo.userMail, friendUser);
            const dataChat = Database.GetDatabaseMessageObject("messages", filename);
            if (dataChat) {
                dataChat.chat.push(message.chat[0]);
                Database.SetDatabaseMessageObjects("messages", filename, dataChat);
            }
            else {
                Database.SetDatabaseMessageObjects("messages", filename, message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    //если пользователь решил поменять логин или почту, то эти данные меняются в сообщениях
    static ChangeUserMessageData(usermail, username, newusername) {
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            if (user != undefined && 'mail' in user) {
                for (const chatId of user.mail) {
                    const messages = MessageRepository.GetDatabaseMessage(chatId.chatId);
                    if (messages != undefined) {
                        if (messages.receiver != usermail) {
                            messages.sender = usermail;
                        }
                        for (const message of messages.chat) {
                            if (message.senderName === username) {
                                message.senderName = newusername;
                            }
                        }
                        Database.SetDatabaseObject("messages", chatId.chatId, messages);
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    static ChangeUserMessageAvatar(usermail, username, avatar) {
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            if (user != undefined && 'mail' in user) {
                for (const chatId of user.mail) {
                    const messages = MessageRepository.GetDatabaseMessage(chatId.chatId);
                    if (messages != undefined) {
                        for (const message of messages.chat) {
                            if (message.senderName === username) {
                                message.avatar = avatar;
                            }
                        }
                        Database.SetDatabaseObject("messages", chatId.chatId, messages);
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
export default MessageRepository;
