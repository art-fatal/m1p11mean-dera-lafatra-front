import {Injectable} from '@angular/core';
import { StaffModel} from 'src/app/models/staff.model';
import {HttpClient} from "@angular/common/http";
import {mapToClientModel, mapToServerModel} from "./mapping.service";
import StaffMapping from "../mappings/staff.mapping";
import {HttpService} from "./http.service";
import {AuthService} from "../modules/auth";

@Injectable({
    providedIn: 'root',
})
export class StaffService extends HttpService<StaffModel, any> {

    constructor(http: HttpClient, authService: AuthService) {
        super(http, "users", authService)
    }

    protected mapToClientModel(serverModel: any): StaffModel {
        return mapToClientModel<StaffModel>(serverModel, StaffMapping);
    }

    protected mapToServerModel(clientModel: StaffModel): any {
        return mapToServerModel(clientModel, StaffMapping)
    }
}