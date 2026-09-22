function Solve() {
  console.log("Solving...");
  let ciphertext = document.getElementById("ciphertext");
  let plaintext = document.getElementById("plaintext");
  let results = document.getElementById("results");

  let innerResults = "";
  for (var n = 1; n < 20; n++) {
    let impossible = false;
    let confidence = 0;
    
    let tableau = {};
    for (var c = 0; c < 26; c++) {
      tableau[String.fromCharCode(c + 65)] = [];
    }

    // load tableau with known plaintext
    for (let t = 0; t < ciphertext.value.length; t++) {
      let col = t % n;
      let curCipher = ciphertext.value[t].toUpperCase();
      
      if (tableau[curCipher].length <= col || tableau[curCipher][col] == null) {
        tableau[curCipher][col] = { Count: 1, Plain: null };
      } else {
        tableau[curCipher][col].Count++;
      }
      
      let curPlain;
      if (plaintext.value.length > t && (curPlain = plaintext.value[t].toLowerCase()) != ' ') {
        let existing;
        if ((existing = tableau[curCipher][col].Plain) != null) {
          if (existing != curPlain) {
            // plaintext mismatch, this period is impossible
            impossible = true;
            break;
          } else if (existing == curPlain) {
            confidence++;
          }
        } else {
          tableau[curCipher][col].Plain = curPlain;
        }
      }
    }
    
    // populate solve with existing plaintext
    let solvedText = [...plaintext.value.toLowerCase()];
    if (!impossible) {
      for (let t = 0; t < ciphertext.value.length; t++) {
        let col = t % n;
        let curCipher = ciphertext.value[t].toUpperCase();
  
        //console.log(`curCipher: ${curCipher}, col: ${col}`);
        try {
          if (tableau[curCipher][col].Plain != null) {
            if (t > solvedText.length) {
              solvedText.push(...(' '.repeat(t - solvedText.length)));
            }
            solvedText[t] = tableau[curCipher][col].Plain;
          }
        } catch (e) {
          console.log(tableau);
          throw e;
        }
      }
    }

    innerResults += `<div>Period ${n} ${impossible ? "(impossible)" : `(${confidence}): <pre>${solvedText.join("")}</pre>`}</div>`;
  }

  results.innerHTML = innerResults;
}

document.addEventListener("DOMContentLoaded", () => {
  let solveBtn = document.getElementById("solve-btn");
  solveBtn.addEventListener("click", Solve);
  console.log("Wiring done.")
});
