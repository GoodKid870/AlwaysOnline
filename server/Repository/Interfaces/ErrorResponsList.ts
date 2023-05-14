import IErrorResponse from "./IErrorResponse";
export const CONST_ERROR_RESPONSE_USER_EXIST: IErrorResponse = {
    codeStatus: 400,
    code: 0,
    response: "Пользователь уже существует",
};
export const CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER: IErrorResponse = {
    codeStatus: 400,
    code: 1,
    response: "Сессия не найдена",
};
export const CONST_ERROR_RESPONSE_INVALID_PASSWORD: IErrorResponse = {
    codeStatus: 400,
    code: 2,
    response: "Неверный пароль",
};
export const CONST_ERROR_RESPONSE_EMPTY_FILLS: IErrorResponse = {
    codeStatus: 400,
    code: 3,
    response: "Пустые поля",
};

export const CONST_ERROR_RESPONSE_USER_NOT_EXIST: IErrorResponse = {
    codeStatus: 400,
    code: 4,
    response: "Пользователь не существует",
}

export const CONST_ERROR_RESPONSE_ALREADY_HAVE_FRIEND: IErrorResponse = {
    codeStatus: 400,
    code: 5,
    response: "Пользователь уже добавлен"
}

export const CONST_ERROR_RESPONSE_FILE_EXTENSION: IErrorResponse = {
    codeStatus:400,
    code: 6,
    response: "Неверное расширение файла"
}


