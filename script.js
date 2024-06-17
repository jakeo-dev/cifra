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

const bold = 'font-weight: bold';
const normal = 'font-weight: normal';

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

        for (i = 0; i < document.getElementById('numsList').getElementsByClassName('item').length; i++) {
            document.getElementById('i' + i).innerText = '';
        }

        let moreNumsLength = document.getElementById('moreNumsList').getElementsByClassName('item').length + document.getElementById('numsList').getElementsByClassName('item').length;
        for (i = document.getElementById('numsList').getElementsByClassName('item').length; i < moreNumsLength; i++) {
            document.getElementById('i' + i).remove();
        }

        let oneNumsArray = [];
        let twoNumsArray = [];
        let threeNumsArray = [];

        for (m = 0; m < wordNumsArray.length; m++) {
            if (inp.includes(wordNumsArray[m])) {
                // put first word in phone number
                finalNumb = inp.replace(wordNumsArray[m], '-' + wordArray[m] + '-');
                oneNumsArray.push(fixDashes(finalNumb));
            }
        }

        if (oneNumsArray.length > 0 && numOfGoodNums(oneNumsArray[oneNumsArray.length - 1]) > 2) {
            // put second word in phone number (if possible)
            for (n = 0; n < oneNumsArray.length; n++) {
                for (o = 0; o < wordNumsArray.length; o++) {
                    if (oneNumsArray[n].includes(wordNumsArray[o])) {
                        finalNumb = oneNumsArray[n].replace(wordNumsArray[o], '-' + wordArray[o] + '-');
                        twoNumsArray.push(fixDashes(finalNumb));
                    }
                }
            }

            if (twoNumsArray.length > 0 && numOfGoodNums(twoNumsArray[twoNumsArray.length - 1]) > 2) {
                // put third word in phone number (if possible)
                for (p = 0; p < twoNumsArray.length; p++) {
                    for (q = 0; q < wordNumsArray.length; q++) {
                        if (twoNumsArray[p].includes(wordNumsArray[q])) {
                            finalNumb = twoNumsArray[p].replace(wordNumsArray[q], '-' + wordArray[q] + '-');
                            threeNumsArray.push(fixDashes(finalNumb));
                        }
                    }
                }
            }
        }

        allNumsArray = removeDuplicates(oneNumsArray.concat(twoNumsArray, threeNumsArray));

        displayedNumsArray = [];
        remainingItemsArray = JSON.parse(JSON.stringify(allNumsArray));

        for (i = 0; i < document.getElementById('numsList').getElementsByClassName('item').length; i++) { // display random phone numbers from the ones generated
            currentItem = remainingItemsArray[Math.floor(Math.random() * remainingItemsArray.length)];
            if (currentItem != undefined) {
                document.getElementById('i' + i).innerText = currentItem;

                displayedNumsArray.push(currentItem);
                remainingItemsArray.splice(remainingItemsArray.indexOf(currentItem), 1);
            }
        }

        document.getElementById('noMatchesText').innerText = '';
        if (displayedNumsArray.length < 1) {
            document.getElementById('noMatchesText').innerText = 'That phone number doesn\'t have any vanity numbers';
        }

        document.getElementById('showAllBtn').classList.add('hidden');
        document.getElementById('showAllBtn').classList.remove('flex');
        document.getElementById('moreNumsList').classList.add('hidden');
        document.getElementById('moreNumsList').classList.remove('grid');
        if (allNumsArray.length > document.getElementById('numsList').getElementsByClassName('item').length) {
            document.getElementById('showAllBtn').classList.remove('hidden');
            document.getElementById('showAllBtn').classList.add('flex');
        }

        //console.log('—————————————————');

        const end = performance.now();
        time = (end - start).toFixed(1);
        /* if (allNumsArray.length > 400) */ console.log('%c' + inp + '%c\n' + allNumsArray.length + ' nums \n' + time + ' ms', bold, normal);
        document.getElementById('generationText').innerText = allNumsArray.length + ' vanity numbers generated in ' + time + ' ms';

        //lalala++;
        //strStr = strStr + '\n' + time;
        //console.log('ALL TIMES: ' + strStr);
        //console.log('NUMBER: ' + lalala);
        //console.log('AVERAGE: ' + getAverage(strStr.replace('\n', '').split('\n'))); 
    }
}

/* let strStr = '';
let lalala = 0;

setInterval(function () {
    randomNum();
    enter();
}, 1);

function getAverage(list) {
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

function longestWord(string) { // find length of longest string of consecutive letters A-Z from the input
    wordsArr = string.replace(/[^A-Z]/g, '+').split('+').sort();
    thingArr = [];
    for (i = 0; i < wordsArr.length; i++) {
        if (wordsArr[i] != '' && wordsArr[i] != null) thingArr.push(wordsArr[i].length);
    }
    thingArr.sort();
    console.log(thingArr);
    return thingArr[thingArr.length - 1].length;
}

function showAllNums() {
    document.getElementById('moreNumsList').classList.remove('hidden');
    document.getElementById('moreNumsList').classList.add('grid');
    document.getElementById('showAllBtn').classList.remove('flex');
    document.getElementById('showAllBtn').classList.add('hidden');

    let moreNumsLength = remainingItemsArray.length;

    for (i = 0; i < moreNumsLength; i++) { // display random phone numbers from the ones generated
        currentItem = remainingItemsArray[Math.floor(Math.random() * remainingItemsArray.length)];
        if (currentItem != undefined) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(currentItem));
            li.classList.add('item');
            li.id = 'i' + (i + document.getElementById('numsList').getElementsByClassName('item').length);
            document.getElementById('moreNumsList').appendChild(li);

            displayedNumsArray.push(currentItem);
            remainingItemsArray.splice(remainingItemsArray.indexOf(currentItem), 1);
        }
    }

    document.getElementById('moreNumsList').querySelectorAll('.item').forEach(function (element) {
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
}

function removeDuplicates(array) {
    // https://stackoverflow.com/a/9229821
    return [...new Set(array)];
}

function randomNum() { // now only generates numbers without 0s or 1s
    str = '';
    for (i = 0; i < 10; i++) {
        str += (Math.random() * (9 - 2) + 2).toFixed(0);
    }
    document.getElementById('input').value = str;
}

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && document.getElementById('input') === document.activeElement) {
        document.getElementById('generate').click();
    }
});