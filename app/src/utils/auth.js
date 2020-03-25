
export function isLogin() {
    const user = localStorage.getItem('user');

    return !user ? (false) : (true);
}
