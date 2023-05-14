import { Request } from 'express';
import { Session, SessionData  } from 'express-session';
import { MulterFile } from 'multer';


interface CustomRequest extends Request {
    session: Session & Partial<SessionData> & { myCustomProperty: string };
    file: MulterFile;
    body: any;
    query: { [key: string]: string };
}

export default CustomRequest