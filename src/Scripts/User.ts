import type Role from './Role';
import type Post from './Post';
import type { _part_sort, _user, _post } from './Interface';

export default class User {

    private id:string;
    private organ_id:string;

    private photo:string;
    private first_name:string;
    private last_name:string;
    private email:string;

    private role:Role;
    private posts:Post[];

    constructor(user:_user) {

        this.id = user.id;
        this.organ_id = user.organ_id;

        this.photo = user.photo;
        this.first_name = user.first_name.toUpperCase();
        this.last_name = user.last_name.toUpperCase();
        this.email = user.email;

        this.role = null;
        this.posts = [];
    }

    set_role(role:Role) {
        this.role = role;
    }

    set_posts(post:Post[]) {
        this.posts = post;
    }

    get_id():string {
        return this.id;
    }

    get_organ_id():string {
        return this.organ_id;
    }

    get_photo():string {
        return this.photo;
    }

    get_first_name():string {
        return this.first_name;
    }

    get_last_name():string {
        return this.last_name;
    }

    get_email():string {
        return this.email;
    }

    get_role():Role {
        return this.role;
    }

    get_posts():Post[] {
        return this.posts;
    }
}