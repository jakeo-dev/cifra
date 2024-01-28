window.onload = readN;

function readN() {
    var txtFile = new XMLHttpRequest();
    txtFile.open('GET', '/words.txt', true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4) {
            // Makes sure the document is ready to parse.
            if (txtFile.status === 200) {
                // Makes sure it's found the file.
                wordList = txtFile.responseText;
                wordArray = wordList.split('\n');

                wordNumsArray = [];
                for (j = 0; j < wordArray.length; j++) {
                    numeroFinal = '';
                    for (k = 0; k < wordArray[j].length; k++) {
                        numero = getNumber(wordArray[j][k]);
                        numeroFinal += numero;
                    }
                    wordNumsArray.push(numeroFinal);
                }
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

let savedNumsList = [];

if (localStorage.getItem('savedNums') !== '[""]' && localStorage.getItem('savedNums') !== null && localStorage.getItem('savedNums') !== undefined) {
    savedNumsList = JSON.parse(localStorage.getItem('savedNums'));
    document.getElementById('slSubtext').classList.add('hidden');

    for (let i = 0; i < savedNumsList.length; i++) {
        let li = document.createElement('li');
        li.innerText = savedNumsList[i];
        li.className = 'savedNum';
        document.getElementById('savedList').appendChild(li);
    }
} else {
    document.getElementById('slSubtext').classList.remove('hidden');
}

document.querySelectorAll('.item').forEach(function (element) {
    element.addEventListener('click', function (event) {
        savedNumsList.push(event.target.innerText);
        localStorage.setItem('savedNums', JSON.stringify(savedNumsList));
        document.getElementById('slSubtext').classList.add('hidden');

        let li = document.createElement('li');
        li.innerText = event.target.innerText;
        li.className = 'savedNum';
        document.getElementById('savedList').appendChild(li);

        alert('Starred number: ' + event.target.innerText + '\n\nView all starred numbers by clicking the star icon');
    });
});

document.getElementById('openSavedBtn').addEventListener('click', function (event) {
    document.getElementById('savedListDiv').classList.toggle('hidden');
});

document.getElementById('savedListDiv').addEventListener('click', function (event) {
    if (event.target.classList.contains('savedNum')) {
        event.target.remove();
        localStorage.setItem('savedNums', JSON.stringify(document.getElementById('savedList').innerText.split('\n')));

        if (localStorage.getItem('savedNums') == '[""]' || localStorage.getItem('savedNums') == null || localStorage.getItem('savedNums') == undefined) {
            document.getElementById('slSubtext').classList.remove('hidden');
        }
    }
}, false);

function enter() {
    let inp = document.getElementById('input').value.replace(/\D/g, '');

    if (/\D/.test(inp)) {
        alert('Do not include any non-number characters in the phone number.');
    } else if (inp.length > 20) {
        alert('Phone number is too long.');
    } else {
        const start = performance.now();

        for (i = 0; i < document.getElementsByClassName('item').length; i++) {
            document.getElementById('i' + i).innerText = '';
        }

        let aNumsList = [];
        let bNumsList = [];
        let cNumsList = [];

        for (m = 0; m < wordNumsArray.length; m++) {
            if (inp.includes(wordNumsArray[m])) {
                // put first word in phone number
                finalNumb = inp.replace(wordNumsArray[m], '-' + wordArray[m] + '-');
                aNumsList.push(fixDashes(finalNumb));
            }
        }

        if (aNumsList.length > 0 && numOfGoodNums(aNumsList[aNumsList.length - 1]) > 2) {
            // put second word in phone number (if possible)
            for (n = 0; n < aNumsList.length; n++) {
                for (o = 0; o < wordNumsArray.length; o++) {
                    if (aNumsList[n].includes(wordNumsArray[o])) {
                        finalNumb = aNumsList[n].replace(wordNumsArray[o], '-' + wordArray[o] + '-');
                        bNumsList.push(fixDashes(finalNumb));
                    }
                }
            }

            if (bNumsList.length > 0 && numOfGoodNums(bNumsList[bNumsList.length - 1]) > 2) {
                // put third word in phone number (if possible)
                for (p = 0; p < bNumsList.length; p++) {
                    for (q = 0; q < wordNumsArray.length; q++) {
                        if (bNumsList[p].includes(wordNumsArray[q])) {
                            finalNumb = bNumsList[p].replace(wordNumsArray[q], '-' + wordArray[q] + '-');
                            cNumsList.push(fixDashes(finalNumb));
                        }
                    }
                }
            }
        }

        allNumsList = removeDuplicates(aNumsList.concat(bNumsList, cNumsList));

        let displayedNumsList = [];
        let tempItemsList = JSON.parse(JSON.stringify(allNumsList));

        for (i = 0; i < document.getElementsByClassName('item').length; i++) { // display random phone numbers from the ones generated
            currentItem = tempItemsList[Math.floor(Math.random() * tempItemsList.length)];
            if (currentItem != undefined) {
                document.getElementById('i' + i).innerText = currentItem;
                displayedNumsList.push(currentItem);
                tempItemsList.splice(tempItemsList.indexOf(currentItem), 1);
            }
        }

        document.getElementById('noMatchesText').innerText = '';
        if (displayedNumsList.length < 1) {
            document.getElementById('noMatchesText').innerText = 'That phone number doesn\'t have any vanity numbers';
        }

        document.getElementById('showMoreBtn').classList.add('hidden');
        document.getElementById('showMoreBtn').classList.remove('flex');
        document.getElementById('moreNumsList').classList.add('hidden');
        document.getElementById('moreNumsList').classList.remove('grid');
        if (displayedNumsList.length > 18) {
            document.getElementById('showMoreBtn').classList.remove('hidden');
            document.getElementById('showMoreBtn').classList.add('flex');
        }

        //console.log('—————————————————');

        const end = performance.now();
        time = (end - start).toFixed(1);
        console.log(time + ' ms');
        document.getElementById('generationText').innerText = 'Generated in ' + time + ' ms';

        /* lalala++;
        strStr = strStr + '\n' + time;
        console.log('ALL TIMES: ' + strStr);
        console.log('NUMBER: ' + lalala);
        console.log('AVERAGE: ' + getAverage(strStr.replace('\n', '').split('\n'))); */
    }
}

/* let strStr = '';
let lalala = 0;

setInterval(function () {
    randomNum();
    enter();
}, 2100); */

/* function getAverage(list) {
    return (list.map(item => Number(item)).reduce((a, b) => a + b) / list.length).toFixed(1);
} */

function getLetters(inp) {
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

function fixDashes(unfixed) { // only put one dash between numbers and letters
    fixed = unfixed.replaceAll(/--+/g, '-').toUpperCase();
    if (fixed.startsWith('-')) fixed = fixed.substring(1);
    if (fixed.endsWith('-')) fixed = fixed.substring(0, fixed.length - 1);
    return fixed;
}

function numOfGoodNums(string) { // find length of longest string of consecutive numbers 2-9 from the input
    numsArr = string.replace(/[^2-9]/g, '+').split('+').sort(function (a, b) { return a - b });
    return numsArr[numsArr.length - 1].length;
}

function showMoreNums() {
    document.getElementById('moreNumsList').classList.remove('hidden');
    document.getElementById('moreNumsList').classList.add('grid');
    document.getElementById('showMoreBtn').classList.remove('flex');
    document.getElementById('showMoreBtn').classList.add('hidden');
}

function removeDuplicates(array) {
    // https://stackoverflow.com/a/9229821
    return [...new Set(array)];
}

function randomNum() {
    document.getElementById('input').value = Math.floor(Math.random() * 10000000000);
}

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && document.getElementById('input') === document.activeElement) {
        document.getElementById('generate').click();
    }
});