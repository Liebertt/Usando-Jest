export class User {
    id?: number;
    name: string;
    email: string;

    constructor(_name: string, _email: string){
        this.name = _name;
        this.email = _email;
    }
}