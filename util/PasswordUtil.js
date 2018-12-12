/**
 * Created by Szane on 16/10/25.
 */
function generateRandomPassword() {
    var upperChars = 'ABCEDFGHIJKLMNOPQRSTUVWXYZ';
    var lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    var r1 = Math.floor(Math.random() * 26);
    var r2 = Math.floor(Math.random() * 26);
    var first = upperChars.substr(r1, 1);
    var second = lowerChars.substr(r2, 1);
    var number = '';
    for (var i = 0; i < 6; i++) {
        number += Math.floor(Math.random() * 9);
    }
    return first + second + number;
}
module.exports = {generateRandomPassword: generateRandomPassword};