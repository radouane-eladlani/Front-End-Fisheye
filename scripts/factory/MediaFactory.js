class MediaFactory{
    constructor(data){
        if("image" in data){
            return new Photo(data)
        }
        return new Video(data)
    }
}