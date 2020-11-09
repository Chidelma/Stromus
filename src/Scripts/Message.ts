import type { _msg } from './Interface';

export default class Message {

    private id:string;
    private chat_id:string;
    private user_id:string;
    private msg:string;
    private name:string;
    private photo:string;
    private date:string;

    constructor(msg:_msg) {

        this.id = msg.id;
        this.chat_id = msg.chat_id;
        this.user_id = msg.user_id;
        this.msg = msg.message;
        this.name = msg.name;
        this.photo = msg.photo;
        this.date = msg.date;
    }

    get_id(): string {
        return this.id;
    }

    get_chat_id():string {
        return this.chat_id;
    }

    get_user_id(): string {
        return this.user_id;
    }

    get_msg():string {
        return this.msg;
    }

    get_name():string {
        return this.name;
    }

    get_photo():string {
        return this.photo;
    }

    get_date():string {
        return this.date;
    }
}