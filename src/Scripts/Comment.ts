import type { _comment } from './Interface';

export default class Comment {

    private id:string;
    private post_id:string;
    private user_id:string

    private name:string;
    private msg:string;
    private date:string;
    private photo:string;

    constructor(comment:_comment) {

        this.id = comment.id;
        this.post_id = comment.post_id;
        this.user_id = comment.user_id;

        this.name = comment.name;
        this.msg = comment.msg;
        this.date = comment.date;
        this.photo = comment.photo;
    }

    get_id():string {
        return this.id;
    }

    get_post_id():string {
        return this.post_id;
    }

    get_user_id():string {
        return this.user_id;
    }

    get_name():string {
        return this.name;
    }

    get_msg():string {
        return this.msg;
    }

    get_date():string  {
        return this.date;
    }

    get_photo():string {
        return this.photo;
    }
}