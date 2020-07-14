import axios from 'axios'

const url = process.env.REACT_APP_HOST_URL

const fbUser = body => axios.post(`${url}auth.php`, body).then(res => res)
const appUser = body => axios.post(`${url}auth.php`, body, {withCredentials: true}).then(res => res)
const assoc = body => axios.post(`${url}assoc.php`, body).then(res => res)
const kokous = body => axios.post(`${url}kokous.php`, body).then(res => res)
const osallistujat = body => axios.post(`${url}osallistujat.php`, body).then(res => res)
const documents = body => axios.post(`${url}documents.php`, body).then(res => res)
const esityslista = body => axios.post(`${url}data.php`, body).then(res => res)

export default { fbUser, appUser, assoc, kokous, osallistujat, documents, esityslista }