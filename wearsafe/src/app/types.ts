export interface FireDBMessage{
    [key: string] : Message
} 

export interface Message{
    id: number,
    text: string,
    date: string,
    key: string
}