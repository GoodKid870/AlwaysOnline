class WebManager {
    static SendErrorResponse(error, res, payload = undefined) {
        res.statusCode = error.codeStatus;
        res.send({
            status: false,
            code: error.code,
            response: error.response,
            ...payload
        });
    }
}
export default WebManager;
