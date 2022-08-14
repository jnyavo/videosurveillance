const authServices = {
    getSocketAuth:()=>new Promise((resolve,reject)=>{
        axios.get(`${window.location.protocol}//${window.location.host}/auth/socketauth`).then(data=>resolve(data.data))
            .catch(err=>reject(err))
    })
}