import IErrorResponse from "./IErrorResponse";
export const CONST_ERROR_RESPONSE_USER_EXIST: IErrorResponse = {
    codeStatus: 400,
    code: 0,
    response: "user_exist",
};
export const CONST_ERROR_RESPONSE_NOT_HAVE_X_SESSION_TOKEN_HEADER: IErrorResponse = {
    codeStatus: 400,
    code: 1,
    response: "not_found_x_session_token_in_header",
};
export const CONST_ERROR_RESPONSE_INVALID_PASSWORD: IErrorResponse = {
    codeStatus: 400,
    code: 2,
    response: "invalid_password",
};
export const CONST_ERROR_RESPONSE_EMPTY_FILLS: IErrorResponse = {
    codeStatus: 400,
    code: 3,
    response: "empty_fills",
};

export const CONST_ERROR_RESPONSE_USER_NOT_EXIST: IErrorResponse = {
    codeStatus: 400,
    code: 4,
    response: "user_not_exist",
}


