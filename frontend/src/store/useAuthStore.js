import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser : {name : "azeem", _id : 123, age : 24},
    isLoggedIn : false,

    login : () => {
        set({isLoggedIn : true});
    }
}))