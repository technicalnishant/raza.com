export function isValidaEmail(email: string): boolean {
    //const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
    var re = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    console.log("your email address is "+email);
    console.log(re.test(email));
    return re.test(email);
}

export function isNumericOnly(number: string) {
    const reg = new RegExp('^[0-9]+$');
    return reg.test(number);
}

export function isNullOrUndefined(value: any) {
    if(value === undefined || value === null)
    return true;
}

export function isValidPhoneNumber(phoneNumber: string) {
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return regex.test(phoneNumber);

}

export function autoCorrectIfPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber.startsWith('+') && !isNumericOnly(phoneNumber)) {
        return phoneNumber;
    }

    const length = phoneNumber.length;

    if (phoneNumber.startsWith('+1') && length === 12)
        return phoneNumber;
    else if (phoneNumber.startsWith('1') && length === 11)
        return `+${phoneNumber}`;
    else if (phoneNumber.startsWith('+44') && length >= 9)
        return phoneNumber;
    else if (phoneNumber.startsWith('44') && length >= 8)
        return `+${phoneNumber}`;
    else if (length === 10)
        return `+1${phoneNumber}`;
    return phoneNumber;
}


export function isValidPhoneOrEmail(phoneOrEmail: string) {
    const isValidEmail = isValidaEmail(phoneOrEmail);
    const isValidNumber = isValidPhoneNumber(phoneOrEmail);

    if (isValidEmail)
        return true;

    if (isValidNumber)
        return true;

    return false;

}