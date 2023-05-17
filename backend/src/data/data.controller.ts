import { Controller, Get } from '@nestjs/common';
import {DataService} from "./data.service";

@Controller('status')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Get()
    getData(){
        return this.dataService.getData()
    }
}
