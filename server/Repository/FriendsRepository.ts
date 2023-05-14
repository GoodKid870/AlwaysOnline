//импортируем репозитории
import Database from "./Database";
import UserRepository from "./UserRepository";


//работа с репозиторием друзья
class FriendsRepository {
    public static GetDatabaseFriends(id){
        try {
            const friends = Database.GetDatabaseObject("friends", id)
            return friends
        } catch (e) {
            return undefined
        }
    }

    //выдаем массив из друзей для пользователя
    public static GetDatabasefriendsListFromUser(userMail){
        const user = UserRepository.GetUserFromEmail(userMail)
        const friends: string[] = []
        if (user != undefined && 'friends' in user){
            for (const userId of user.friends){
                const people = FriendsRepository.GetDatabaseFriends(userId.userId)
                if (people != undefined){
                    friends.push(people)
                }
            }
        }
        return friends
    }


    //добавляем пользователя в друзья

    //здесь мы создаем друга как объект
    public static CreateFriendObject(username, userMail, userId, avatar) {
        return {
            "friends": {
                "username": username,
                "usermail": userMail,
                "userId": userId,
                "avatar": avatar
            }
        }
    }

    //тут мы добавляем друга в список
    public static AddFriendToList(friendList, userId) {
        friendList.push({ "userId": userId });
    }


    //а здесь происходит непосредственно сама логика
    public static AddSomeFriend(userMail, username, email, userId, avatar) {
    try {
        const user = UserRepository.GetUserFromEmail(userMail);
        const user2 = UserRepository.GetUserFromEmail(email);
        const userFriend: {friends: {username: any, usermail: any, userId: any, avatar: any}} = FriendsRepository.CreateFriendObject(username, email, userId, avatar);
        const userFriend2: {friends: {username: any, usermail: any, userId: any, avatar: any}} = FriendsRepository.CreateFriendObject(user.userInfo.userLogin, user.userInfo.userMail, user.userInfo.userId, user.avatar);

        if (!user.friends) {
            user.friends = [];
        }


        if (!user2.friends) {
            user2.friends = [];
        }

        FriendsRepository.AddFriendToList(user.friends, userId);
        FriendsRepository.AddFriendToList(user2.friends, user.userInfo.userId);

        Database.SetDatabaseObject("users", userMail, user);
        Database.SetDatabaseObject("friends", userId, userFriend);
        Database.SetDatabaseObject("users", email, user2);
        Database.SetDatabaseObject("friends", user.userInfo.userId, userFriend2);
    } catch (c) {
        console.log(c);
    }
}

    //если пользователь решил, что ему нужно поменять логин или почту, то эти данные меняются во френде
    public static ChangeFriendsData(usermail, newusername, newusermail) {
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            const friend = FriendsRepository.GetDatabaseFriends(user.userInfo.userId);
            if (friend != undefined) {
                friend.friends.username = newusername;
                friend.friends.usermail = newusermail
                Database.SetDatabaseObject("friends", user.userInfo.userId, friend);
            }
        } catch (e) {
            console.error(e);
        }
    }

    public static ChangeFriendAvatar(usermail, username, avatar){
        try {
            const user = UserRepository.GetUserFromEmail(usermail);
            const friend = FriendsRepository.GetDatabaseFriends(user.userInfo.userId);
            if (friend != undefined) {
                friend.friends.username = username;
                friend.friends.avatar = avatar
                Database.SetDatabaseObject("friends", user.userInfo.userId, friend);
            }
        } catch (e) {
            console.error(e);
        }
    }

    public static HasFriend(usermail, userId) {
        const user = UserRepository.GetUserFromEmail(usermail);
        try {
            return user.friends.some((friend) => friend.userId == userId);
        } catch (e) {
            return false
        }
    }

    public static DeleteSomeFriend(usermail, userId, friendMail, friendUserId){
        const user = UserRepository.GetUserFromEmail(usermail);
        const friend = UserRepository.GetUserFromEmail(friendMail)
        try {
            user.friends.forEach((item, index) => {
                if (item.userId == friendUserId) {
                    user.friends.splice(index, 1);
                    Database.SetDatabaseObject("users", user.userInfo.userMail, user);
                }
            });
            friend.friends.forEach((item, index) => {
                if (item.userId == userId) {
                    friend.friends.splice(index, 1);
                    Database.SetDatabaseObject("users", friend.userInfo.userMail, friend);
                }
            });
        } catch (e) {
            console.log(e)
        }
    }
}

export default FriendsRepository