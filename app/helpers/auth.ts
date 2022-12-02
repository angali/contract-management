// import cookie from 'js-cookie';
import Router from "next/router";
import {
  getCookies as _getCookies,
  getCookie as _getCookie,
  setCookie as _setCookie,
  deleteCookie as _deleteCookie
} from "cookies-next";

//set in cookie
export const setCookie = _setCookie;
//remove from cookie
export const removeCookie = _deleteCookie;

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = _getCookie;

// set in local storage
export const setLocalStorage = (key: string, value: string) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage
export const removeLocalStorage = (key: string) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and local storage during sign in
export const authenticate = (response: any, next: any) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

export const getToken = () => {
  if (process.browser) {
    return getCookie("token");
  }
};

// access user info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user")!);
      } else {
        return false;
      }
    }
  }
};

//logout
export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};
