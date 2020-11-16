import type { _event } from './Interface';

export default class Event {

    private id:string;
    private organ_id:string;
    private title:string;
    private date_time:string;
    private desc:string;
    private location:string;
    private rsvp:number;

    constructor(event:_event) {

        this.id = event.id;
        this.organ_id = event.organ_id;
        this.title = event.title.toUpperCase();
        this.date_time = event.date_time;
        this.desc = event.desc;
        this.location = event.location;
        this.rsvp = 0;
    }

    get_id():string {
        return this.id;
    }

    set_event(new_event:_event) {
        this.title = new_event.title.toUpperCase();
        this.date_time = new_event.date_time;
        this.desc = new_event.desc;
        this.location = new_event.location;
    }

    get_organ_id():string {
        return this.organ_id;
    }

    get_title():string {
        return this.title;
    }

    get_date_time():string {
        return this.date_time;
    }

    get_desc():string {
        return this.desc;
    }

    get_location():string {
        return this.location;
    }

    get_rsvp():number {
        return this.rsvp;
    }

    set_rsvp(count:number) {
        this.rsvp = count;
    }

    increment_rsvp() {
        this.rsvp += 1;
    }

    decrement_rsvp() {
        this.rsvp -= 1;
    }
}