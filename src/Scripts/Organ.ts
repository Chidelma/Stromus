import User from './User';
import Event from './Event';
import Role from './Role';
import Post from './Post';
import type { _organ, _part_sort, _user, _role, _post, _event, _chat, _pending } from './Interface';
import { $dynamo, $admin } from './Init';

export default class Organ {

    private id:string;
    private admin_id:string;
    
    private photo:string;
    private name:string;
    private founded:string;
    private address:string;
    private city:string;
    private state:string;
    private code:string;
    private country:string;

    private users:User[];
    private events:Event[];
    private posts:Post[];
    private chats:_chat[];
    private pends:_pending[];

    private user:User;

    constructor(organ:_organ) {

        this.id = organ.id;
        this.admin_id = organ.admin_id;

        this.photo = organ.photo;
        this.name = organ.name.toUpperCase();
        this.founded = organ.founded;
        this.address = organ.address.toUpperCase();
        this.city = organ.city.toUpperCase();
        this.state = organ.state.toUpperCase();
        this.code = organ.code.toUpperCase();
        this.country = organ.country.toUpperCase();
    }

    async setup_users() {

        this.users = [];

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: this.id
        }

        this.pends = await $dynamo.queryItem('PENDING', key_value);

        let user_results:_user[] = await $dynamo.queryItem('USERS', key_value);

        for(let i = 0; i < user_results.length; i++) {

            let user:User = new User();

            user.set_user(user_results[i]);

            user.set_role(await this.get_role(user.get_id()));

            if(user.get_email() == $admin.get_email())
                this.user = user;

            this.users.push(user);
        }
    }

    async setup_posts() {

        this.posts = [];

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: this.id
        }

        let post_results:_post[] = await $dynamo.queryItem('POSTS', key_value);

        for(let i = 0; i < post_results.length; i++) {

            let post:Post = new Post(post_results[i]);

            post.setup_comments();

            post.set_likes(await this.get_likes(post_results[i].id));

            this.posts.push(post);
        }
    }

    async setup_events() {

        this.events = [];

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: this.id
        }

        let event_results:_event[] = await $dynamo.queryItem('EVENTS', key_value);

        let today_date:Date = new Date();

        for(let i = 0; i < event_results.length; i++) {

            let event_date:Date = new Date(event_results[i].date_time);

            if(today_date.getTime() <= event_date.getTime()) {

                let new_event:Event = new Event(event_results[i]);

                new_event.set_rsvp(await this.get_rsvp(event_results[i].id));

                this.events.push(new_event);
            }
        }
    }

    async setup_chats() {

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: this.id
        }

        this.chats = await $dynamo.queryItem('CHATS', key_value);
    }

    find_chat(chat_id:string): _chat {
        return this.chats.find(chat => chat.chat_id == chat_id);
    }

    async get_rsvp(event_id:string): Promise<number> {

        let key_value:_part_sort = {
            part_key: 'event_id',
            part_value: event_id
        }

        let count:number = await $dynamo.getCount('RSVP', key_value);

        return count;
    }

    async get_likes(post_id:string): Promise<number> {

        let key_value:_part_sort = {
            part_key: 'post_id',
            part_value: post_id
        }

        let count:number = await $dynamo.getCount('LIKES', key_value);

        return count;
    }

    async get_role(user_id:string): Promise<Role> {

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: this.id,
            sort_key: 'user_id',
            sort_value: user_id
        }

        let user_role:_role = await $dynamo.getItem('ROLES', key_value);

        return new Role(user_role);
    }

    set_users(users:User[]) {
        this.users = users;
    }

    set_events(events:Event[]) {
        this.events = events;
    }

    set_posts(posts:Post[]) {
        this.posts = posts;
    }

    change_post(post:Post) {
        for(let i = 0; i < this.posts.length; i++) {
            if(post.get_id() == this.posts[i].get_id()) {
                this.posts[i] = post;
                break;
            }
        }
    }

    sort_all() {
        this.posts = this.posts.sort((a, b) => new Date(b.get_date()).getTime() - new Date(a.get_date()).getTime());
    }

    get_id():string {
        return this.id;
    }

    get_admin_id():string {
        return this.admin_id;
    }

    get_photo():string {
        return this.photo;
    }

    get_name():string {
        return this.name;
    }

    get_founded():string {
        return this.founded;
    }

    get_address():string {
        return this.address;
    }

    get_city():string {
        return this.city;
    }

    get_state():string {
        return this.state;
    }

    get_code():string {
        return this.code;
    }

    get_country():string {
        return this.country;
    }

    get_users():User[] {
        return this.users;
    }

    add_user(user:User) {
        this.users.push(user);
    }

    get_events():Event[] {
        return this.events;
    }

    add_event(event:Event) {
        this.events.unshift(event);
        this.events = this.events.sort((a, b) => new Date(b.get_date_time()).getTime() - new Date(a.get_date_time()).getTime());
    }

    get_posts():Post[] {
        return this.posts;
    }

    add_post(post:Post) {
        this.posts.unshift(post);
    }

    get_user():User {
        return this.user;
    }

    add_pend(pend:_pending) {
        this.pends.push(pend);
    }

    get_pends():_pending[] {
        return this.pends;
    }
}