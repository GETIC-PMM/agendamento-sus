declare module 'jwtoken' {
    export function generateAccessToken(payload: string): string;
    export function saveAccessToken(token: string): void;
    export function getAccessToken(): string;
    export function removeAccessToken(): void;
    export function decodeAccessToken(token: string): string;
    export function isAuthenticated(): boolean;
}