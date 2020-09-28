export interface Item {
    id: string;
    u_id?: string;
    name: string;
    quantity: number;
    unit_price: number;
    description?: string;
    user_id?: string;
    created_at?: string;
    created_by?: string;
    total_price?: string;
    date_created?: string;
    is_deleted?: number;
}

export interface EditMode {
    type: string;
    title: string;
    item?: Item;
    color?: string;
}

export interface CategoryStat {
    type?: string;
    no_of_items?: number;
    total_price?: number;
    date_created?: string;
    short_name?: string;
}


export interface LoggedUser {
    biography: string;
    code: string;
    created_at: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    nick_name: string;
    password: string;
    phone: string;
    photo_url: string;
}

export interface BackUp {
    uid: string;
    user: LoggedUser;
    data: Item[];
}

export interface ApiResponse {
    status: boolean;
    message: string;
    error: any;
    response: any;
}

export interface BackingUpProgress {
    status: boolean;
    message: string;
    result?: any;
}

export interface AppUser {
    biography?: string;
    code?: string;
    code_sent_at?: string;
    created_at?: string;
    data_last_updated_on?: string;
    email?: string;
    email_verified?: string;
    email_verified_at?: string;
    first_name?: string;
    id?: string;
    last_name?: string;
    password?: string;
    phone?: string;
    photo_url?: string;
    updated_at?: string;
    user_name?: string;
}
