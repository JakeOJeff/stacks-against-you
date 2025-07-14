// lib/userSession.ts

let userSession: { room: string; userName: string } = { room: "", userName: "" };

export const setUserSession = (room: string, userName: string) => {
  userSession = { room, userName };
};

export const getUserSession = () => userSession;