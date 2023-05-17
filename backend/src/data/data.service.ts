import { Injectable } from '@nestjs/common';
import {fakeData} from "../moks/fakedata";

@Injectable()
export class DataService {
    getData(){
        return fakeData;
    }
}
