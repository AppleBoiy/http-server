import {constructResponse} from "../utils/responseUtils";

export class EchoHandler {
    GET(echoStr: string): string {
        return constructResponse("200", "OK", "text/plain", echoStr);
    }
}