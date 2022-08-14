const Table = require('./table')

module.exports = class Camera extends Table
{

    tablename = 'camera';
    
    constructor(fields)
    {
        super(fields)
        if (Object.keys(fields).length == 0)
            this.fields = 
            {
                id_camera:null,
                name_camera:null,
                token:null,
                topic:null                
            }
    }

}