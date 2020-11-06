import type { _role } from './Interface';

export default class Role {

    private organ_id:string;
    private user_id:string;

    private add_post:boolean;
    private edit_post:boolean;
    private delete_post:boolean;

    private add_user:boolean;
    private edit_user:boolean;
    private delete_user:boolean;

    private add_event:boolean;
    private edit_event:boolean;
    private delete_event:boolean;

    constructor(role:_role) {
        
        this.organ_id = role.organ_id;
        this.user_id = role.user_id;

        this.add_post = role.add_post;
        this.edit_post = role.edit_post;
        this.delete_post = role.delete_post;

        this.add_user = role.add_user;
        this.edit_user = role.edit_user;
        this.delete_user = role.delete_user;

        this.add_event = role.add_event;
        this.edit_event = role.edit_event;
        this.delete_event = role.delete_event;
    }

    get_organ_id():string {
        return this.organ_id;
    }

    get_user_id():string {
        return this.user_id;;
    }

    can_add_post():boolean {
        return this.add_post;
    }

    can_edit_post():boolean {
        return this.edit_post;
    }

    can_delete_post():boolean {
        return this.delete_post;
    }

    can_add_user():boolean {
        return this.add_user;
    }

    can_edit_user():boolean {
        return this.edit_user;
    }

    can_delete_user():boolean {
        return this.delete_user;
    }

    can_add_event():boolean {
        return this.add_event;
    }

    can_edit_event():boolean {
        return this.edit_event;
    }

    can_delete_event():boolean {
        return this.delete_event;
    }
}