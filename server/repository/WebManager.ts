import IErrorResponse from "./Interfaces/IErrorResponse";
import { Response } from "express";

class WebManager {
    public static SendErrorResponse(error: IErrorResponse, res: Response, payload: any = undefined): void {
        res.statusCode = error.codeStatus;
        res.send({
            status: false,
            code: error.code,
            response: error.response,
            ...payload
        });
    }
}
export default WebManager