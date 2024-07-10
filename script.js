"use strict";

let inputSlider = document.querySelector("[data-lengthSlider]");
let lengthDisplay = document.querySelector("[data-lengthNumber]");
let copyBtn = document.querySelector("[data-copy]");
let copyMsg = document.querySelector("[data-copyMsg]");
let passwordDisplay = document.querySelector("[data-passwordDisplay]");
let uppercaseCheck = document.querySelector("#uppercase");
let lowercaseCheck = document.querySelector("#lowercase");
let numbersCheck = document.querySelector("#numbers");
let symbolsCheck = document.querySelector("#symbols");
let indicator = document.querySelector("[data-indicator]");
let generateBtn = document.querySelector(".generateButton");
let allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 1;
let funArr = [];
const symbols = '`~!@#$%^&*()-_=+|]}[{";:/?.>,<';
const len = symbols.length;
setIndicator("gray");
handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.textContent = `${passwordLength}`;
  let percent = (passwordLength / 20) * 100;
  inputSlider.style.background = `linear-gradient(to right, blue ${percent}%, white ${percent}%)`;
}

function setIndicator(color) {
  indicator.style.cssText = `background-color:${color}; width:20px; height:20px; border-radius:50%; box-shadow:0px 0px 20px ${color}`;
}

function getRndInteger(min, max) {
  let num = Math.random() * (max - min);
  num += min;
  num = parseInt(num);
  return num;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  let character = getRndInteger(97, 122);
  character = String.fromCharCode(character);
  return character;
}

function generateUpperCase() {
  let character = getRndInteger(65, 90);
  character = String.fromCharCode(character);
  return character;
}

function generateSymbol() {
  let character = getRndInteger(0, len);
  character = symbols[character];
  return character;
}

function calcStrength(p) {
  let hasU = false;
  let hasL = false;
  let hasN = false;
  let hasS = false;

  if (uppercaseCheck.checked) hasU = true;
  if (lowercaseCheck.checked) hasL = true;
  if (numbersCheck.checked) hasN = true;
  if (symbolsCheck.checked) hasS = true;

  if (hasU && hasL && (hasS || hasN) && p.length >= 8) setIndicator("green");
  else if ((hasU || hasL) && (hasS || hasN) && p.length >= 6)
    setIndicator("orange");
  else setIndicator("red");
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.textContent = "copied";
  } catch (e) {
    copyMsg.textContent = "failed";
  }

  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
    copyMsg.textContent = "";
  }, 2000);
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  passwordLength = parseInt(passwordLength);
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value != "") {
    copyMsg.textContent = "";
    copyContent();
  }
});

function shufflePassword(array) {
  //Fisher Yates Method

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let arr = "";
  array.forEach((el) => {
    arr += el;
  });
  return arr;
}

generateBtn.addEventListener("click", () => {
  password = "";
  funArr = [];
  if (checkCount <= 0) return;

  if (checkCount > passwordLength) {
    passwordLength = checkCount;
    handleSlider();
  }

  if (lowercaseCheck.checked) funArr.push(generateLowerCase);
  if (uppercaseCheck.checked) funArr.push(generateUpperCase);
  if (numbersCheck.checked) funArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funArr.push(generateSymbol);

  for (let i = 0; i < funArr.length; i++) {
    console.log(typeof passwordLength);
    password += `${funArr[i]()}`;
  }

  for (let i = 0; i < passwordLength - funArr.length; i++) {
    console.log(typeof passwordLength);
    let index = getRndInteger(0, funArr.length - 1);
    password += `${funArr[index]()}`;
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength(password);
});
