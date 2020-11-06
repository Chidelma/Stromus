import Amplify, { Auth } from 'aws-amplify';
import type Admin from './Admin';

export default class Cognito {

    private auth:any;

    constructor() {

        Amplify.configure({
            Auth : {
                identityPoolId: process.env.IDENTITY_POOL_ID,
                region: 'ca-central-1',
                identityPoolRegion: 'ca-central-1',
                userPoolId: process.env.USER_POOL_ID,
                userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID
            }
        });

        this.auth = Auth;
    }

    isAuth():boolean {
        return this.auth.user != null ? true : false;
    }

    isVerified():boolean {
        return this.auth.user.verified == true ? true : false;
    }

    async signUp(password:string, user:Admin):Promise<boolean> {

        let added:boolean = false;

        try {

            let username:string = user.get_email();
            let email:string = user.get_email();;
            let given_name:string = user.get_first_name();
            let family_name:string = user.get_last_name();

            await this.auth.signUp({
                username,
                password,
                attributes: {
                    email,      
                    given_name, 
                    family_name
                }
            });

            added = true;

        } catch (error) {
            console.log('error signing up:', error);
        }

        return added;
    }

    async confirmSignUp(code:string, user:Admin):Promise<boolean> {

        let confirmed:boolean = false;
        let username:string = user.get_email();

        try {
            await this.auth.confirmSignUp(username, code);
            confirmed = true;
        } catch (error) {
            console.log('error confirming sign up', error);
        }

        return confirmed;
    }

    async signIn(username:string, password:string):Promise<any> {

        let logged:boolean = false;
        let last_name:string = '';

        try {
            const user = await this.auth.signIn(username, password);
            last_name = user.attributes.family_name;
            logged = true;
        } catch (error) {
            console.log('error signing in', error);
        }

        return { logged, last_name };
    }

    async resendConfirmationCode(user:Admin):Promise<boolean> {

        let username:string = user.get_email();
        let resent:boolean = false;

        try {
            await this.auth.resendSignUp(username);
            console.log('code resent successfully');
            resent = true;
        } catch (err) {
            console.log('error resending code: ', err);
        }

        return resent;
    }

    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
}