import { atom } from 'recoil';

export const activeLinkState = atom({
    key: "activeLink",
    default: "/"
})