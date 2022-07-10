function stringMult(str: string, times: number): string {
    var res: string = "";
    for (var i = 0; i < times; ++i)
        res += str;
    return res;
}

function includes<T>(arr: Array<T>, cond: (obj: T) => boolean): boolean {
    for (var i = 0; i < arr.length; ++i)
        if (cond(arr[i]))
            return true;
    return false;
}

function stringEndsWith(str: string, sub: string): boolean {
    if (str.length < sub.length)
        return false;
    
    for (var i = 0; i < sub.length; ++i) {
        if (sub.charAt(sub.length - i) !== str.charAt(str.length - i))
            return false;
    }
    return true;
}

function seqEndsWith<T>(seq: Array<T> | string, sub: Array<T> | string) {
    if (typeof seq === 'string' && typeof sub === 'string')
        return stringEndsWith(seq, sub);
    if (seq.length < sub.length)
        return false;
    for (var i = 0; i < sub.length; ++i) {
        if (sub[sub.length - i] !== seq[seq.length - i])
            return false;
    }
    return true;
}

export { stringMult, includes, seqEndsWith };