export const setUserSession = (user, accessToken) => {
    sessionStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('token', accessToken)
}
export const setSessionRole = (role) => {
    sessionStorage.setItem('role', JSON.stringify(role))    //  yhdistyksen nimi ja rooli {yhdistys:yhdistys, role: role}
}
export const getSessionRole = () => {
    const userrole = sessionStorage.getItem('role')
    if(userrole) return JSON.parse(userrole)
    else return null 
}
export const removeRole = () => {   // onko tämä käytössä? 
    sessionStorage.removeItem('role')
}
export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    window.location.reload()            // reload on workaround console.loggerin erroriin: "You are overriding current access token, that means some other app is expecting different access token and you will probably break things."
}


