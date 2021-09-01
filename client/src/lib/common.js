exports.sortTable = (rows, field, direction) => {
    if (field != null && field != undefined) {
        rows.sort( function(a, b) {
            let arg1,arg2;
            if( field.includes(".")) {
                let fieldList = field.split(".");
                if (fieldList.length === 3) {
                    if ( a[fieldList[0]][fieldList[1]][fieldList[2]] != null){
                        if ( typeof a[fieldList[0]][fieldList[1]][fieldList[2]] === "number" ||
                        a[fieldList[0]][fieldList[1]][fieldList[2]] === null) {
                            arg1 = a[fieldList[0]][fieldList[1]][fieldList[2]];
                            arg2 = b[fieldList[0]][fieldList[1]][fieldList[2]];
                        }
                        else {
                            arg1 = a[fieldList[0]][fieldList[1]][fieldList[2]].toLowerCase();
                            arg2 = b[fieldList[0]][fieldList[1]][fieldList[2]].toLowerCase();
                        }
                    }
                }
                else {
                    if ( typeof a[fieldList[0]][fieldList[1]] === "number" ||
                        a[fieldList[0]][fieldList[1]] === null) {
                        arg1 = a[fieldList[0]][fieldList[1]];
                        arg2 = b[fieldList[0]][fieldList[1]];

                        return arg1 - arg2;
                    }
                    else{
                        arg1 = a[fieldList[0]][fieldList[1]].toLowerCase();
                        arg2 = b[fieldList[0]][fieldList[1]].toLowerCase();
                    }
                }   
            }
            else {
                if ( typeof a[field] === "number" ||
                    a[field] === null) {
                    arg1 = a[field];
                    arg2 = b[field];

                    return arg1 - arg2;
                }
                else {
                    arg1 = a[field].toLowerCase();
                    arg2 = b[field].toLowerCase();
                }
            }

            if (arg1 < arg2) { return -1; }
            if (arg1 > arg2) { return 1; }

            return 0;
        })
    }

    if ( direction === "desc") {
        rows.reverse();
    }

    return rows.slice(0);
}