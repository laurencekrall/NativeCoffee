import ImageRequest from "./ImageRequest";

export default interface CreateRateableRequest extends ImageRequest {
    name : string,
    fileName : string,
    rating : number
}