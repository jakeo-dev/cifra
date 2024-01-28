// ALTERNATE METHDOD: convert each word in the words.txt list to a string of numbers, then go through each combination of word numbers to see if the phone number contains any of them



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

        for (l = 0; l < 18; l++) {
            document.getElementById('i' + l).innerText = '';
        }

        let currentNumsList = [];

        for (m = 0; m < wordNumsArray.length; m++) {
            if (inp.includes(wordNumsArray[m])) {
                // put first word in phone number
                finalNumb1 = inp.replace(wordNumsArray[m], '-' + wordArray[m] + '-');

                // put second word (if possible) in phone number
                for (n = 0; n < wordNumsArray.length; n++) {
                    if (finalNumb1.includes(wordNumsArray[n])) {
                        finalNumb1 = finalNumb1.replace(wordNumsArray[n], '-' + wordArray[n] + '-');
                    }
                }

                // fix dashes
                finalNumb2 = finalNumb1.replaceAll('--', '-').toUpperCase();
                if (finalNumb2.startsWith('-')) finalNumb2 = finalNumb2.substring(1);
                if (finalNumb2.endsWith('-')) finalNumb2 = finalNumb2.substring(0, finalNumb2.length - 1);

                currentNumsList.push(finalNumb2);
            }
        }

        document.getElementById('noMatchesText').innerText = '';
        if (currentNumsList.length < 1) {
            document.getElementById('noMatchesText').innerText = 'That phone number doesn\'t any vanity numbers';
        }

        for (i = 0; i < 18; i++) { // display 18 random phone numbers from the ones generated
            currentItem = currentNumsList[Math.floor(Math.random() * currentNumsList.length)];
            if (currentItem != undefined) document.getElementById('i' + i).innerText = currentItem;
            currentNumsList.splice(currentNumsList.indexOf(currentItem), 1);

        }

        //console.log('—————————————————');

        const end = performance.now();
        time = (end - start).toFixed(2);
        console.log(time + ' ms');

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

function randomNum() {
    document.getElementById('input').value = Math.floor(Math.random() * 10000000000);
}

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && document.getElementById('input') === document.activeElement) {
        document.getElementById('generate').click();
    }
});