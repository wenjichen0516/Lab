// Used to check if an array is equal to the other one
exports.equar = (a, b) => {
    // check array length
    if (a.length !== b.length) {
        return false
    } else {
        // loop value inside array
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false
            }
        }
        return true;
    }
}