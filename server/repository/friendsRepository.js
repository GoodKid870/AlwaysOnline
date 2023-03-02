//импортируем репозитории
import {database} from "./database.js";
import {userRepository} from "./userRepository.js";


//работа с репозиторием друзья
export const friendsRepository = {
    getDatabasefriends(id){
        try {
            const friends = database.getDatabaseObject("friends", id)
            return friends
        } catch (e) {
            return undefined
        }
    },

    //выдаем массив из друзей для пользователя
    getDatabasefriendsListFromUser(userMail){
        const user = userRepository.getUserFromEmail(userMail)
        const friends = []
        if (user != undefined && 'friends' in user){
            for (const userId of user.friends){
                const people = friendsRepository.getDatabasefriends(userId.userId)
                if (people != undefined){
                    friends.push(people)
                }
            }
        }
        return friends
    },


    //добавляем пользователя в друзья

    //здесь мы создаем друга как обьект
    createFriendObject(username, userMail, userId, avatar) {
    return {
        "friends": {
            "username": username,
            "usermail": userMail,
            "userId": userId,
            "avatar": avatar
        }
    };
},

    //тут мы добавляем друга в список
    addFriendToList(friendList, userId) {
    friendList.push({ "userId": userId });
},


    //а здесь происходит непосредственно сама логика
    addSomeFriend(userMail, username, email, userId, avatar) {
    try {
        const user = userRepository.getUserFromEmail(userMail);
        const user2 = userRepository.getUserFromEmail(email);
        const userFriend = friendsRepository.createFriendObject(username, email, userId, avatar);
        const userFriend2 = friendsRepository.createFriendObject(user.userInfo.userLogin, user.userInfo.userMail, user.userInfo.userId, user.avatar);

        if (!user.friends) {
            user.friends = [];
        }

        if (!user2.friends) {
            user2.friends = [];
        }

        friendsRepository.addFriendToList(user.friends, userId);
        friendsRepository.addFriendToList(user2.friends, user.userInfo.userId);

        database.setDatabaseObject("users", userMail, user);
        database.setDatabaseObject("friends", userId, userFriend);
        database.setDatabaseObject("users", email, user2);
        database.setDatabaseObject("friends", user.userInfo.userId, userFriend2);
    } catch (c) {
        console.log(c);
    }
},

    //если пользоваетль решил, что ему нужно поменять логин или почту, то эти данные меняются во френде
    changeFriendsData(usermail, newusername, newusermail) {
        try {
            const user = userRepository.getUserFromEmail(usermail);
            const friend = friendsRepository.getDatabasefriends(user.userInfo.userId);
            if (friend != undefined) {
                friend.friends.username = newusername;
                friend.friends.usermail = newusermail
                database.setDatabaseObject("friends", user.userInfo.userId, friend);
            }
        } catch (e) {
            console.error(e);
        }
    },

    changeFriendAvatar(usermail, username, avatar){
        try {
            const user = userRepository.getUserFromEmail(usermail);
            const friend = friendsRepository.getDatabasefriends(user.userInfo.userId);
            if (friend != undefined) {
                friend.friends.username = username;
                friend.friends.avatar = avatar
                database.setDatabaseObject("friends", user.userInfo.userId, friend);
            }
        } catch (e) {
            console.error(e);
        }
    },

    hasFriend(usermail, userId) {
        const user = userRepository.getUserFromEmail(usermail);
        try {
            return user.friends.some((friend) => friend.userId === userId);
        } catch (e) {
            return false
        }
    },

    deleteSomeFriend(usermail, userId, friendMail, friendUserId){
        const user = userRepository.getUserFromEmail(usermail);
        const friend = userRepository.getUserFromEmail(friendMail)
        try {
            user.friends.forEach((item, index) => {
                if (item.userId == friendUserId) {
                    user.friends.splice(index, 1);
                    database.setDatabaseObject("users", user.userInfo.userMail, user);
                }
            });
            friend.friends.forEach((item, index) => {
                if (item.userId == userId) {
                    friend.friends.splice(index, 1);
                    database.setDatabaseObject("users", friend.userInfo.userMail, friend);
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}