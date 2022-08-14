const Table = require('./table')

module.exports = class Video extends Table
{

    tablename = 'video';

    constructor(fields)
    {
        super(fields)
        if (Object.keys(fields).length == 0)
            this.fields = 
            {
                num_video:null,
                path_video:null,
                date_video:null,
                id_camera:null                
            }
    }

}