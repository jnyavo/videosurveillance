
const userServices = 
{
    getUserList :()=>new Promise((resolve,reject)=>{
        axios.get(`${window.location.protocol}//${window.location.host}/user/all`).then(data=>resolve(data.data))
            .catch(err=>reject(err))
    }),
    updateUser:(user)=>new Promise((resolve,reject)=>{
        axios.put(`${window.location.protocol}//${window.location.host}/user/all`,{...user}).then(data=>resolve(data.data))
        .catch(err=>reject(err))
    }),
    getUser:(id)=>new Promise((resolve,reject)=>{
        axios.get(`${window.location.protocol}//${window.location.host}/user/${id}`).then(data=>resolve(data.data))
            .catch(err=>reject(err))
    }),
    deleteUser:(id)=>new Promise((resolve,reject)=>{
        axios.delete(`${window.location.protocol}//${window.location.host}/user?id=${id}`).then(data=>resolve(data.data))
        .catch(err=>reject(err))
    })
}