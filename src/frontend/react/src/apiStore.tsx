import { create } from "zustand";
export var token: string | null;

interface ap {
  id: string,
  user: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image: string;
  qrcode: any;
  twofa: boolean;
  auth: boolean;
  friends: any;
  friendreq: number;
  setInfo: (
    id: string,
    user: string,
    first_name: string,
    last_name: string,
    login: string,
    email: string,
    image: string,
    twofa: boolean,
    friends: any,
  ) => void;
  setUsername: (user: string | undefined) => void;
  setImage: (newImage: string | undefined) => void;
  setqrcode: (newqr: any | undefined) => void;
  setauth: (authorized: boolean | undefined) => void;
  settwofa: (Twofa: boolean | undefined) => void;
  setfriendreq: (Friendreq: number) => void;
  [Symbol.iterator]: () => Iterator<string>;
}

export const useApi = create<ap>((set) => ({
  id: '',
  user: '',
  first_name: '',
  last_name: '',
  login: '',
  email: '',
  image: '',
  qrcode: '',
  twofa: false,
  auth: false,
  friends: [],
  friendreq: 0,
  setInfo: (
    Id,
    User,
    First_name,
    Last_name,
    Login,
    Email,
    Image,
    Twofa,
    Friends,
  ) =>
    set(() => ({
      id: Id,
      user: User,
      first_name: First_name,
      last_name: Last_name,
      login: Login,
      email: Email,
      image: Image,
      friends: Friends,
      twofa: Twofa,
    })),
  setUsername: (newUser) => set(() => ({ user: newUser })),
  setImage: (newImage) => set(() => ({ image: newImage })),
  setqrcode: (newqr) => set(() => ({ qrcode: newqr })),
  setauth: (authorized) => set(() => ({ auth: authorized })),
  settwofa: (Twofa) => set(() => ({ twofa: Twofa })),
  setfriendreq: (Friendreq) => set(() => ({ friendreq: Friendreq })),
  [Symbol.iterator]: function* () {
    yield this.id;
    yield this.user;
    yield this.first_name;
    yield this.last_name;
    yield this.login;
    yield this.email;
    yield this.image;
    yield this.friends;
  },
}));
