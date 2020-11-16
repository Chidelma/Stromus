import Comment from './Comment';
import type { _post, _part_sort, _comment } from './Interface';
import { $dynamo } from './Init';

export default class Post {

    private id:string;
    private organ_id:string;
    private user_id:string;

    private photo:string;
    private name:string;
    private date:string;
    private msg:string;
    private likes:number;

    private comments:Comment[];

    constructor(post:_post) {

        this.id = post.id;
        this.organ_id = post.organ_id;
        this.user_id = post.user_id;

        this.photo = post.photo;
        this.name = post.name;
        this.date = post.date;
        this.msg = post.msg;

        this.likes = 0;
    }

    async setup_comments() {

        this.comments = [];

        let key_value:_part_sort = {
            part_key: 'post_id',
            part_value: this.id
        }

        let results:_comment[] = await $dynamo.queryItem('COMMENTS', key_value);

        for(let i = 0; i < results.length; i++) 
            this.comments.push(new Comment(results[i]));

        this.comments = this.comments.sort((a, b) => new Date(b.get_date()).getTime() - new Date(a.get_date()).getTime());
    }

    set_comments(comments:Comment[]) {
        this.comments = comments;
    }

    add_comment(comment:Comment) {
        this.comments.unshift(comment);
    }

    get_id():string {
        return this.id;
    }

    set_msg(new_msg:string) {
        this.msg = new_msg;
    }

    get_organ_id():string {
        return this.organ_id;
    }

    get_user_id():string {
        return this.user_id;
    }
    
    get_photo():string {
        return this.photo;
    }

    get_name():string {
        return this.name;
    }

    get_date():string {
        return this.date;
    }

    get_msg():string {
        return this.msg;
    }

    get_likes():number {
        return this.likes;
    }

    set_likes(likes:number) {
        this.likes = likes;
    }

    increment_likes() {
        this.likes += 1;
    }

    decrement_likes() {
        this.likes -= 1;
    }

    get_comments():Comment[] {
        return this.comments;
    }
}