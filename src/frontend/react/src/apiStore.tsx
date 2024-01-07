// hashStore.ts
// import { useEffect, useState } from 'react';
import { create } from 'zustand';
export var token: string | null;

interface ap {
  id: string,
  user: string;
  first_name: string;
  last_name: string;
  login: string;
  email: string;
  image: string;
  setInfo: (id: string, user: string, first_name: string, last_name: string, login: string, email: string, image: string) => void;
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
  setInfo: (Id, User, First_name, Last_name, Login, Email, Image) =>
    set(() => ({
      id: Id,
      user: User,
      first_name: First_name,
      last_name: Last_name,
      login: Login,
      email: Email,
      image: Image,
    })),
  [Symbol.iterator]: function* () {
    yield this.id;
    yield this.user;
    yield this.first_name;
    yield this.last_name;
    yield this.login;
    yield this.email;
    yield this.image;
  },
}));
