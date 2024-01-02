// hashStore.ts
// import { useEffect, useState } from 'react';
import { create } from 'zustand';
export var token: string | null;

interface ap {
  user: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image: string;
  friends: any;

  setInfo: (user: string, first_name: string, last_name: string, login: string, email: string, image: string, friends: any) => void;
  [Symbol.iterator]: () => Iterator<string>;
}

export const useApi = create<ap>((set) => ({
  user: '',
  first_name: '',
  last_name: '',
  login: '',
  email: '',
  image: '',
  friends: [],
  setInfo: (User, First_name, Last_name, Login, Email, Image, Friends) =>
    set(() => ({
      user: User,
      first_name: First_name,
      last_name: Last_name,
      login: Login,
      email: Email,
      image: Image,
      friends: Friends
    })),
  [Symbol.iterator]: function* () {
    yield this.user;
    yield this.first_name;
    yield this.last_name;
    yield this.login;
    yield this.email;
    yield this.image;
    yield this.friends;
  },
}));
