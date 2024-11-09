window.onload = readN;

function readN() {
    const txtFile = new XMLHttpRequest();
    txtFile.open('GET', '/words.txt', true);
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4) {
            // Makes sure the document is ready to parse.
            if (txtFile.status === 200) {
                // Makes sure it's found the file.
                let wordList = txtFile.responseText;
                wordsArray = wordList.split('\n');

                numerosArray = [];
                for (let j = 0; j < wordsArray.length; j++) {
                    let numero = '';
                    for (let k = 0; k < wordsArray[j].length; k++) {
                        let numeroLetter = getNumber(wordsArray[j][k]);
                        numero += numeroLetter;
                    }
                    numerosArray.push(numero);
                }
            }
        }
    }
    txtFile.send(null);
}

const bold = 'font-weight: bold';
const normal = 'font-weight: normal';

//console.log('%c' + '• INPUTTED NUMBER' + '%c\n' + '• # OF GENERATED VANITY NUMBERS\n' + '• AMOUNT OF TIME TO COMPLETE GENERATION\n' + '• INPUTTED NUMBER QUALITY (takes into account: average quality of individual generated vanity nums and the # of generated numbers)', bold, normal);

let savedNumsList = [];

if (localStorage.getItem('savedNums') !== '[""]' && localStorage.getItem('savedNums') !== null && localStorage.getItem('savedNums') !== undefined) {
    savedNumsList = JSON.parse(localStorage.getItem('savedNums'));
    document.getElementById('slSubtext').classList.add('hidden');

    for (let savedNum of savedNumsList) {
        let li = document.createElement('li');
        li.innerText = savedNum;
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

document.addEventListener('click', function (event) {
    if (event.target.id != 'savedListDiv' && event.target.id != 'openSavedBtn' && event.target.id != 'openSavedBtnI' && event.target.id != 'openSavedBtnS' && event.target.className != 'savedNum') {
        document.getElementById('savedListDiv').classList.add('hidden');
    }
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

        for (let i = 0; i < document.getElementById('numsList').getElementsByClassName('item').length; i++) {
            document.getElementById('i' + i).innerText = '';
        }

        let moreNumsLength = document.getElementById('moreNumsList').getElementsByClassName('item').length + document.getElementById('numsList').getElementsByClassName('item').length;
        for (let i = document.getElementById('numsList').getElementsByClassName('item').length; i < moreNumsLength; i++) {
            document.getElementById('i' + i).remove();
        }

        let oneNumsArray = [];
        let twoNumsArray = [];
        let threeNumsArray = [];

        for (let m = 0; m < numerosArray.length; m++) {
            if (inp.includes(numerosArray[m])) {
                // put first word in phone number
                finalNumb = inp.replace(numerosArray[m], '-' + wordsArray[m] + '-');
                oneNumsArray.push(fixDashes(finalNumb));
            }
        }

        if (oneNumsArray.length > 0 && (numOfGoodNums(oneNumsArray[oneNumsArray.length - 1]) > 2 || numOfGoodNums(oneNumsArray[0]) > 2)) {
            // put second word in phone number (if possible)
            for (let n = 0; n < oneNumsArray.length; n++) {
                for (let o = 0; o < numerosArray.length; o++) {
                    if (oneNumsArray[n].includes(numerosArray[o])) {
                        finalNumb = oneNumsArray[n].replace(numerosArray[o], '-' + wordsArray[o] + '-');
                        twoNumsArray.push(fixDashes(finalNumb));
                    }
                }
            }

            if (twoNumsArray.length > 0 && (numOfGoodNums(twoNumsArray[twoNumsArray.length - 1]) > 2 || numOfGoodNums(twoNumsArray[0]) > 2)) {
                // put third word in phone number (if possible)
                for (let p = 0; p < twoNumsArray.length; p++) {
                    for (let q = 0; q < numerosArray.length; q++) {
                        if (twoNumsArray[p].includes(numerosArray[q])) {
                            finalNumb = twoNumsArray[p].replace(numerosArray[q], '-' + wordsArray[q] + '-');
                            threeNumsArray.push(fixDashes(finalNumb));
                        }
                    }
                }
            }
        }

        allNumsArray = removeDuplicates(oneNumsArray.concat(twoNumsArray, threeNumsArray));

        allNumsScoresArray = JSON.parse(JSON.stringify(allNumsArray));
        for (let i = 0; i < allNumsScoresArray.length; i++) {
            allNumsScoresArray[i] = getScore(allNumsArray[i]);
        }

        avgVanityNumberScore = (getAverage(allNumsScoresArray) + (inp.length / 40)).toFixed(2); // average quality of each individual generated vanity number, doesnt account for # of vanity nums generated, but accounts for phone number length since longer numbers typically have lower average scores
        overallNumberQuality = (getAverage(allNumsScoresArray) + (inp.length / 40) + (allNumsArray.length / (inp.length * 20))).toFixed(2); // overall quality of the inputted phone number, accounting for both avgVanityNumberScore and # of vanity nums generated

        topNumsArray = [];
        displayedNumsArray = [];
        remainingItemsArray = JSON.parse(JSON.stringify(allNumsArray));

        if (allNumsArray.length > 500) l = 150;
        else if (allNumsArray.length > 250) l = 75;
        else if (allNumsArray.length > 100) l = 35;
        else if (allNumsArray.length > 60) l = 25;
        else if (allNumsArray.length > 18) l = 18;
        else l = allNumsArray.length;

        let tempAllNumsScoresArray = JSON.parse(JSON.stringify(allNumsScoresArray));
        for (let j = 0; j < l; j++) { // determine the top l vanity numbers
            greatestNumIndex = indexOfGreatestNumber(tempAllNumsScoresArray);
            greatestItem = allNumsArray[greatestNumIndex];

            topNumsArray.push(greatestItem);

            tempAllNumsScoresArray[greatestNumIndex] = -99999;
        }

        for (let k = 0; k < document.getElementById('numsList').getElementsByClassName('item').length; k++) {
            randomItem = topNumsArray[Math.floor(Math.random() * topNumsArray.length)];
            if (randomItem != undefined) {
                displayedNumsArray.push(randomItem);
                document.getElementById('i' + k).innerText = randomItem;

                topNumsArray.splice(topNumsArray.indexOf(randomItem), 1);
                remainingItemsArray.splice(remainingItemsArray.indexOf(randomItem), 1);
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
        let time = (end - start).toFixed(1);
        /* if (allNumsArray.length > 400) */ console.log('%c' + inp + '%c\n' + allNumsArray.length + ' nums\n' + time + ' ms\n' + overallNumberQuality + ' quality', bold, normal);
        document.getElementById('generationText').innerText = allNumsArray.length + ' vanity numbers generated in ' + time + ' ms';

        //lalala++;
        //strStr = strStr + '\n' + time;
        //console.log('ALL TIMES: ' + strStr);
        //console.log('NUMBER: ' + lalala);
        //console.log('AVERAGE: ' + avg(strStr.replace('\n', '').split('\n'))); 
    }
}

/* let strStr = '';
let lalala = 0;

setInterval(function () {
    randomGen();
}, 1);

function avg(list) {
    return (list.map(item => Number(item)).reduce((a, b) => a + b) / list.length).toFixed(1);
} */

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
    return str.toUpperCase() != str.toLowerCase();
}

function fixDashes(unfixed) { // only put one dash between numbers and letters
    let fixed = unfixed.replaceAll(/--+/g, '-').toUpperCase();
    if (fixed.startsWith('-')) fixed = fixed.substring(1);
    if (fixed.endsWith('-')) fixed = fixed.substring(0, fixed.length - 1);
    return fixed;
}

function numOfGoodNums(string) { // find length of longest string of consecutive numbers 2-9 from the input
    let numsArr = string.replace(/[^2-9]/g, '+').split('+').sort(function (a, b) { return a - b });
    return numsArr[numsArr.length - 1].length;
}

function longestWord(string) { // find length of longest string of consecutive letters A-Z from the input
    let wordsArr = string.replace(/[^A-Z]/g, '+').split('+').sort();
    let thingArr = [];
    for (let word of wordsArr) {
        if (word != '' && word != null) thingArr.push(word.length);
    }
    thingArr.sort();
    return thingArr[thingArr.length - 1].length;
}

function showAllNums() {
    document.getElementById('moreNumsList').classList.remove('hidden');
    document.getElementById('moreNumsList').classList.add('grid');
    document.getElementById('showAllBtn').classList.remove('flex');
    document.getElementById('showAllBtn').classList.add('hidden');

    let moreNumsLength = remainingItemsArray.length;

    for (let i = 0; i < moreNumsLength; i++) { // display random phone numbers from the ones generated
        randomItem = remainingItemsArray[Math.floor(Math.random() * remainingItemsArray.length)];
        if (randomItem != undefined) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(randomItem));
            li.classList.add('item');
            li.id = 'i' + (i + document.getElementById('numsList').getElementsByClassName('item').length);
            document.getElementById('moreNumsList').appendChild(li);

            displayedNumsArray.push(randomItem);
            remainingItemsArray.splice(remainingItemsArray.indexOf(randomItem), 1);
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

function shuffle(array) {
    let tempArray = array.slice();
    let finalArray = [];

    for (let i of array) {
        let itemNow = tempArray[Math.floor(Math.random() * tempArray.length)];
        finalArray.push(itemNow);
        tempArray.splice(tempArray.indexOf(itemNow), 1);
    }

    return finalArray;
}

function randomGen() { // gets random number w/o 0's or 1's, then generates vanity numbers
    let str = '';
    for (let i = 0; i < 10; i++) {
        str += (Math.random() * (9 - 2) + 2).toFixed(0);
    }
    document.getElementById('input').value = str;

    enter();
}

function numLetters(string) { // returns number of letters in a string
    const letters = string.match(/[A-z]/g);
    return letters ? letters.length : 0; // returns 0 if null
}

function numNumbers(string) { // returns number of numbers in a string
    const numbers = string.match(/\d/g);
    return numbers ? numbers.length : 0; // returns 0 if null
}

function numDashes(string) { // returns number of dashes in a string
    const dashes = string.match(/-/g);
    return dashes ? dashes.length : 0; // returns 0 if null
}

function getAverage(array) { // returns the average of an array of numbers
    let sum = 0;
    for (let number of array) sum += number;
    return sum / array.length;
}

function getScore(vanity) { // returns score of a vanity number, can be negative or positive
    return numLetters(vanity) - numNumbers(vanity) - (numDashes(vanity) - 1)
}

function indexOfSmallestNumber(array) {
    let smallest = 99999;
    let smallestNumIndex = -1;

    for (let i = 0; i < array.length; i++) {
        if (array[i] < smallest) {
            smallest = array[i];
            smallestNumIndex = i;
        }
    }
    return smallestNumIndex;
}

function indexOfGreatestNumber(array) {
    let greatest = -99999;
    let greatestNumIndex = -1;

    for (let i = 0; i < array.length; i++) {
        if (array[i] > greatest) {
            greatest = array[i];
            greatestNumIndex = i;
        }
    }
    return greatestNumIndex;
}

document.getElementById('input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && document.getElementById('input') === document.activeElement) {
        document.getElementById('generate').click();
    }
});