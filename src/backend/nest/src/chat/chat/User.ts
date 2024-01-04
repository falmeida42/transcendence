export enum UserStatus {
    OFFLINE,
    ONLINE,
    GAME,

}

export interface UserInformation {
    id: string,
    username: string,
    status: UserStatus
}