userServices.getUserList().then(data=>{
    var tbody = document.getElementById('userList')
    data.map((user)=>{
        var row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.lname}</td>
        <td>${user.fname}</td>
        <td>${user.email}</td>
        <td>${user.superuser}</td>
        <td>
            <a href="#" class="btn waves-effect waves-light" >
                <i class="material-icons">edit</i>
            </a>
            
            <button type="submit" class="btn waves-effect waves-light red" value="${user.id}" name="id_equipement">
                <i class="material-icons">delete</i>
            </button>
        </td>
        `;
        tbody.appendChild(row);
    })
})