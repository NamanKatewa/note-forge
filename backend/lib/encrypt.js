function caeserEncrypt(data) {
  const shift = process.env.SHIFT;
  let result = "";
  for (let i = 0; i < data.length; i++) {
    let charCode = data.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
    } else {
      result += data[i];
    }
  }
  return result;
}

function caesarDecrypt(data) {
  const shift = process.env.SHIFT;
  return caeserEncrypt(data, 26 - shift);
}

module.exports = { caeserEncrypt, caesarDecrypt };
