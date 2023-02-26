let wordList;
let wordArray;

readN();
function readN() {
    var txtFile = new XMLHttpRequest();
    txtFile.open('GET', 'http://localhost:5500/words.txt', true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4) {
            // Makes sure the document is ready to parse.
            if (txtFile.status === 200) {
                // Makes sure it's found the file.
                wordList = txtFile.responseText;
                wordArray = wordList.split('\n');
            }
        }
    }
    txtFile.send(null);
}

let two = [
    'A',
    'B',
    'C',
]

let three = [
    'D',
    'E',
    'F',
]

let four = [
    'G',
    'H',
    'I',
]

let five = [
    'J',
    'K',
    'L',
]

let six = [
    'M',
    'N',
    'O',
]

let seven = [
    'P',
    'Q',
    'R',
    'S',
]

let eight = [
    'T',
    'U',
    'V',
]

let nine = [
    'W',
    'X',
    'Y',
    'Z',
]

function enter() {
    a = 0;

    for (i = 0; i < 10; i++) { // number of phone numbers to output
        if (a < 500) { // how many attempts at trying to find matches before giving up
            let letters = genLetters();

            for (k = 0; k < wordArray.length; k++) { // loop through all words to see if the random letters matches any
                matches = letters.toLowerCase().includes(wordArray[k]);
                if (matches) {
                    let wordSep = Array.from(wordArray[k]);

                    let finalNums = '';

                    for (m = 0; m < wordSep.length; m++) {
                        num = getNumber(wordSep[m]);
                        finalNums = finalNums + num;
                    }

                    final = document.getElementById('input').value.replace(finalNums, wordArray[k]);

                    b = 0;

                    if (b < 500) { // how many attempts at trying to find matches before giving up
                        thing = letters.replace(wordArray[k].toUpperCase(), finalNums);
                        for (o = 0; o < wordArray.length; o++) { // loop through all words to see if the random letters matches any
                            matches2 = thing.toLowerCase().includes(wordArray[o]);
                            if (matches2) {
                                console.log('DOUBLE MATCH!!!!!! with ' + wordArray[o]);
                                let wordSep = Array.from(wordArray[o]);

                                let finalNums = '';

                                for (m = 0; m < wordSep.length; m++) {
                                    num = getNumber(wordSep[m]);
                                    finalNums = finalNums + num;
                                }

                                n = final.indexOf(finalNums);

                                if (isLetter(final.substring(n + finalNums.length).charAt(0))) {
                                    final = final.replace(finalNums, wordArray[o] + '-');

                                    console.log(n);
                                    console.log(n + finalNums.length);
                                    console.log(final.substring(n + finalNums.length).charAt(0));
                                    console.log(isLetter(final.substring(n + finalNums.length).charAt(0)));

                                } else if (isLetter(final.substring(n - 1).charAt(0))) {
                                    final = final.replace(finalNums, '-' + wordArray[o]);

                                    console.log(n);
                                    console.log(n - 1);
                                    console.log(final.substring(n - 1).charAt(0));
                                    console.log(isLetter(final.substring(n - 1).charAt(0)));

                                } else {
                                    final = final.replace(finalNums, wordArray[o]);
                                }

                                break;

                            } else {
                                b++;
                            }
                        }
                    }

                    let finalSep = Array.from(final);

                    for (m = 0; m < finalSep.length; m++) { // add dashes
                        if (!isNaN(finalSep[m]) && (isNaN(finalSep[m + 1]) && finalSep[m + 1] != null)) {
                            finalSep[m] = finalSep[m] + '-';
                        } else if (isNaN(finalSep[m]) && !isNaN(finalSep[m + 1])) {
                            finalSep[m] = finalSep[m] + '-';
                        }
                    }

                    document.getElementById('i' + i).innerText = finalSep.join('').toUpperCase();

                    break;
                }
            }

            if (!matches && i > -1) {
                i = i - 1;

                a++;
            }

        } else {
            i = 10;

            for (l = 1; l < 10; l++) {
                document.getElementById('i' + l).innerText = '';
            }
            document.getElementById('i0').innerText = 'Unable to find any matches';
        }
    }

    document.getElementById('list').classList.remove('hidden');
}

function genLetters() {
    let inp = document.getElementById('input').value;
    let inpArr = Array.from(inp);

    let randomLetter = '';
    let final = '';

    for (j = 0; j < inpArr.length; j++) {

        switch (inpArr[j]) {
            case '0':
                randomLetter = '0';
                break;

            case '1':
                randomLetter = '1';
                break;

            case '2':
                randomLetter = two[Math.floor(Math.random() * two.length)];
                break;

            case '3':
                randomLetter = three[Math.floor(Math.random() * three.length)];
                break;

            case '4':
                randomLetter = four[Math.floor(Math.random() * four.length)];
                break;

            case '5':
                randomLetter = five[Math.floor(Math.random() * five.length)];
                break;

            case '6':
                randomLetter = six[Math.floor(Math.random() * six.length)];
                break;

            case '7':
                randomLetter = seven[Math.floor(Math.random() * seven.length)];
                break;

            case '8':
                randomLetter = eight[Math.floor(Math.random() * eight.length)];
                break;

            case '9':
                randomLetter = nine[Math.floor(Math.random() * nine.length)];
                break;
        }

        final = final + randomLetter;
    }

    return final;
}

function getNumber(letter) {
    letter = letter.toUpperCase();

    if (letter == 'A' || letter == 'B' || letter == 'C') {
        return '2';
    } else if (letter == 'D' || letter == 'E' || letter == 'F') {
        return '3';
    } else if (letter == 'G' || letter == 'H' || letter == 'I') {
        return '4';
    } else if (letter == 'J' || letter == 'K' || letter == 'L') {
        return '5';
    } else if (letter == 'M' || letter == 'N' || letter == 'O') {
        return '6';
    } else if (letter == 'P' || letter == 'Q' || letter == 'R' || letter == 'S') {
        return '7';
    } else if (letter == 'T' || letter == 'U' || letter == 'V') {
        return '8';
    } else if (letter == 'W' || letter == 'X' || letter == 'Y' || letter == 'Z') {
        return '9';
    }
}

function isLetter(str) {
    if (str.toUpperCase() != str.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}