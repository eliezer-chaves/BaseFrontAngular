export interface iUser {
    usr_first_name: string;
    usr_last_name: string;
    usr_email: string;
    usr_phone: string;
}

export interface iUserLogin {
    usr_email: string;
    usr_password: string;
}

export interface iUserRegister {
    usr_first_name: string;
    usr_last_name: string;
    usr_email: string;
    usr_phone: string;
    usr_password: string;
    usr_password_confirmation: string;
}