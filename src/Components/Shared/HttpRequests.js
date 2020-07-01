import axios from 'axios'

const url = 'http://localhost/kokousapi/'
 
const fbUser = body => axios.post(`${url}auth.php`, body).then(res => res)
const appUser = body => axios.post(`${url}auth.php`, body).then(res => res)
const assoc = body => axios.post(`${url}assoc.php`, body).then(res => res)
const kokous = body => axios.post(`${url}kokous.php`, body).then(res => res)
const documents = body => axios.post(`${url}documents.php`, body).then(res => res)

export default { fbUser, appUser, assoc, kokous, documents}