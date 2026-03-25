// src/utils/auth.ts
export function getUser() {
  const user = localStorage.getItem('@App:user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('@App:token');
}