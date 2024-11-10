export enum PasswordStrength {
    STRONG="STRONG",
    MEDIUM="MEDIUM",
    WEAK="WEAK"
}

export default class UTILITY {
    public static isValidUser(obj: unknown): obj is { id: string; username: string; password: string } {
        return typeof obj === 'object' &&
               obj !== null &&
               'id' in obj && typeof (obj as { id: unknown }).id === 'string' &&
               'username' in obj && typeof (obj as { username: unknown }).username === 'string' &&
               'password' in obj && typeof (obj as { password: unknown }).password === 'string';
    }

    public static isValidUserWithoutPassword(obj: unknown): obj is { id: string; username: string; } {
        return typeof obj === 'object' &&
               obj !== null &&
               'id' in obj && typeof (obj as { id: unknown }).id === 'string' &&
               'username' in obj && typeof (obj as { username: unknown }).username === 'string'
    }

    public static isString(arg: unknown){
        return typeof arg === 'string';
    }

    public static isNotNull(arg: unknown){
        return typeof arg !== null;
    }

    public static isUsernameValid(username: string): boolean {
        const usernameRegex: RegExp = /^[a-zA-Z0-9_-]+$/;
        if(username.length <= 3 || username.length >= 32) return false;
        return usernameRegex.test(username);
    }

    public static isPasswordStrong(password: string): boolean {
        return this.getPasswordStrength(password) === PasswordStrength.STRONG;
    }

    public static getPasswordStrength(password: string, debug: boolean = false, decentLength: number = 14, minimumLength: number = 7): PasswordStrength {
        
        let strength: number = 0;
        const lowercase: RegExp = /[a-z]/;
        const uppercase: RegExp = /[A-Z]/;
        const numbers: RegExp = /[0-9]/;
        const symbols: RegExp = /[^a-zA-Z0-9]/;

        const hasLowercase: boolean = lowercase.test(password);
        const hasUppercase: boolean = uppercase.test(password);
        const hasNumbers: boolean = numbers.test(password);
        const hasSymbols: boolean = symbols.test(password);
        
        const hasDecentLength: boolean = password.length >= decentLength;
        const hasPoorLength: boolean = password.length < minimumLength;

        if(hasPoorLength) strength--;
        if(hasDecentLength) strength++;
        if(hasLowercase) strength++;
        if(hasUppercase) strength++;
        if(hasNumbers) strength++;
        if(hasSymbols) strength++;

        if(debug){
            console.log(strength)
        }

        switch(true){
            case strength <= 1:
                return PasswordStrength.WEAK;
            case strength >= 2 && strength <= 4:
                return PasswordStrength.MEDIUM;
            case strength >= 5:
                return PasswordStrength.STRONG;
            default:
                return PasswordStrength.WEAK;
        }
    }
}