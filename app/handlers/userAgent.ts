import {constructResponse} from "../utils/responseUtils";

export class UserAgentHandler {
    GET(userAgent: string): string {
        return constructResponse("200", "OK", "text/plain", userAgent);
    }
}