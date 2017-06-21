// DOM Elements
const refill = document.getElementById("refill");
const moneyInput = document.getElementById("money");
const codeInput = document.getElementById("code");
const getChange = document.getElementById("get-change");
const dispense = document.getElementById("dispense");
const clear = document.getElementById("clear");
const btns = document.getElementsByClassName("code");
const moneys = document.getElementsByClassName("money");
const sodaViews = document.getElementsByClassName("soda");

// DOM Event Listeners
// Code Buttons
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", e => {
    VendingMachine.enterCode(e.target.value);
  });
}
// Money Buttons
for (var i = 0; i < moneys.length; i++) {
  moneys[i].addEventListener("click", e => {
    VendingMachine.takeMoney(e.target.value);
  });
}
refill.addEventListener("click", () => {
  VendingMachine.restock();
});
getChange.addEventListener("click", () => {
  VendingMachine.dispenseChange();
});
dispense.addEventListener("click", () => {
  VendingMachine.dispenseRequest();
});
clear.addEventListener("click", () => {
  VendingMachine.clear();
});
// generate a soda view
const makeSodaTemplate = function(color, price) {
  return `<div class="can" style="background-color:${color}"></div><p>$${price}</p>
  `;
};
class Soda {
  constructor(name, price, stock, color, code) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.color = color;
    this.code = code;
  }
}

const coke = new Soda("Coke", 1.25, 2, "#ff0000", "B2");
const sprite = new Soda("Sprite", 1.0, 2, "#03fd2d", "A3");
const fanta = new Soda("Fanta", 1.5, 10, "#ff9130", "D2");
const drPepper = new Soda("Dr. Pepper", 2.0, 2, "#cf0012", "C3");
const gingerAle = new Soda("Ginger Ale", 1.25, 2, "#529850", "B1");
const water = new Soda("Water", 0.5, 2, "#0000ff", "A1");

const VendingMachine = {
  stock: {
    A: [null, null, null],
    B: [null, null, null],
    C: [null, null, null],
    D: [null, null, null]
  },
  money: 0,
  input: "--",
  load() {
    if (localStorage && localStorage.getItem("sodas")) {
      this.stock = JSON.parse(localStorage.getItem("sodas"));
    }
    this.set();
  },
  save() {
    if (localStorage) {
      localStorage.setItem("sodas", JSON.stringify(this.stock));
    }
  },
  set() {
    codeInput.innerHTML = this.input;
    moneyInput.innerHTML = this.money.toFixed(2);
    this.renderSodaCans();
  },
  renderSodaCans() {
    for (let row in this.stock) {
      this.stock[row].map(soda => {
        if (soda) {
          let can = makeSodaTemplate(soda.color, soda.price.toFixed(2));
          if (document.getElementById(soda.code) && soda.stock >= 1) {
            document.getElementById(soda.code).innerHTML = can;
          } else {
            document.getElementById(soda.code).innerHTML = "";
          }
        }
      });
    }
  },
  clear() {
    this.input = "--";
    this.set();
  },
  restock() {
    this.registerSodas([coke, sprite, drPepper, gingerAle, water, fanta]);
  },
  registerSodas(sodas) {
    sodas.map((soda, i) => {
      const str1 = soda.code.toUpperCase().substr(0, 1);
      const str2 = Number(soda.code.substr(1, 2));
      this.stock[str1][str2 - 1] = sodas[i];
    });
    this.set();
    this.save();
  },
  enterCode(code) {
    let one = this.input.substr(0, 1);
    let two = this.input.substr(1, 2);
    if (one == "-") {
      this.input = code + "-";
    } else if (one !== "-" && two == "-") {
      this.input = one + code;
    }
    this.set();
  },
  dispenseRequest() {
    let code = this.input;
    const stock = this.stock;
    // Split the code into row and column
    code = code.split("");
    // Align with JavaScript indexing conventions
    code[1] = Number(code[1] - 1);
    // Check if Soda is in stock
    if (stock[code[0]] && stock[code[0]][code[1]]) {
      this.removeSoda(code[0], code[1]);
    } else {
      this.handleOutOfStock();
    }
  },
  compareMoney(sodaPrice) {
    if (this.money === sodaPrice) {
      this.money = 0;
      return true;
    } else if (this.money > sodaPrice) {
      this.dispenseChange(sodaPrice);
      return true;
    } else {
      this.insufficientFunds();
      return false;
    }
  },
  dispenseChange(sodaPrice) {
    alert("Your change is " + (this.money - sodaPrice).toFixed(2));
    this.money = 0;
    this.set();
  },
  insufficientFunds() {
    alert("Please enter more money");
  },
  takeMoney(money) {
    money = Number(money);
    this.money += money;
    this.set();
  },
  removeSoda(row, index) {
    let select = this.stock[row][index];
    //check if funs are efficient
    if (!this.compareMoney(select.price)) {
      return;
    } else {
      // If amount drops below 1, make out of stock
      if (select.stock < 1) {
        select = null;
        this.handleOutOfStock();
      } else {
        select.stock--;
        alert(
          "Dispensing a " + select.name + " " + select.stock + " remaining"
        );
      }
      this.input = "--";
    }
    this.save();
    this.set();
  },
  handleOutOfStock() {
    if (this.input === "--") {
      alert("Enter a code");
    } else {
      alert("FUUAAAA, out of stock brah");
    }
  }
};

VendingMachine.load();
