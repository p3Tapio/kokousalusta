export const setUserSession = (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', accessToken)
}
export const setSessionRole = (role) => {
    localStorage.setItem('role', JSON.stringify(role))    //  yhdistyksen nimi ja rooli {yhdistys:yhdistys, role: role}
}
export const getSessionRole = () => {
    const userrole = localStorage.getItem('role')
    if(userrole) return JSON.parse(userrole)
    else return null 
}
export const removeRole = () => {   // onko tämä käytössä? 
    localStorage.removeItem('role')
}
export const getToken = () => {
    return localStorage.getItem('token') || null;
}
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}
export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.reload()            // reload on workaround console.loggerin erroriin: "You are overriding current access token, that means some other app is expecting different access token and you will probably break things."
}


