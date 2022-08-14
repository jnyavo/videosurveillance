
/**
 * Classe pour stream sur un fichier ou une sortie
 */

exports.Recorder = class Recorder
{
   
    constructor(stream)
    {
        this._stream=stream
    }

    setStream(stream){
        if(this._stream)
            this._stream?.pause()
        this._stream = stream 
    }

    stop()
    {
        this._stream?.pause()
        this._out?.close()
    }

    streamTo(res)
    {
        if(this._out)
            this.stop();
        this._out = res;
        this._stream?.pipe(res)
    }
}

