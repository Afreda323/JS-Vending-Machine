/**
 * @param {string} name Name of soda
 * @param {number} price Price of soda
 * @param {number} stock amount of sodas in stock
 * @param {string} color Hexidecimal soda color
 * @param {string} code Vending Code for soda
 */

class Soda {
  constructor(name, price, stock, color, code) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.color = color;
    this.code = code;
  }
}

const coke = new Soda("Coke", 1.25, 10, "#ff0000", "B2");
const sprite = new Soda("Sprite", 1.0, 10, "#ff0000", "A3");
const fanta = new Soda(26, 1.5, 10, "#ff0000", "D2");
const drPepper = new Soda("Dr. Pepper", 2.0, 10, "#ff0000", "C3");
const gingerAle = new Soda("Ginger Ale", 1.25, 10, "#ff0000", "B1");
const water = new Soda("Water", 0.5, 10, "#ff0000", "A1");

const VendingMachine = {
  stock: {
    A: [null, null, null],
    B: [null, null, null],
    C: [null, null, null],
    D: [null, null, null]
  },
  load() {
    if (localStorage.getItem("sodas")) {
      this.stock = JSON.parse(localStorage.getItem("sodas"));
    }
  },
  save() {
    localStorage.setItem("sodas", JSON.stringify(this.stock));
  },
  /**
 * @param {array} sodas Takes an array of soda objects
 */
  registerSodas(sodas) {
    sodas.map((soda, i) => {
      const str1 = soda.code.toUpperCase().substr(0, 1);
      const str2 = Number(soda.code.substr(1, 2));
      this.stock[str1][str2 - 1] = sodas[i];
    });
  },
  /**
 * @param {string} code Takes a code in from the user
 */
  takeInput(code) {
    const stock = this.stock;
    // Split the code into row and column
    code = code.split("");
    // Align with JavaScript indexing conventions
    code[1] = Number(code[1] - 1);
    // Check if Soda is in stock
    if (stock[code[0]] && stock[code[0]][code[1]]) {
      return this.removeSoda(code[0], code[1]);
    } else {
      return this.handleOutOfStock();
    }
  },
  /**
 * @param {string} row The row of the stock ie; a, b, c
 * @param {number} index The index of the row
 */
  removeSoda(row, index) {
    let select = this.stock[row][index];
    // If amount drops below 1, make out of stock
    if (select.stock < 1) {
      select = null;
      this.handleOutOfStock();
    } else {
      console.log(`Before: ${select.name} ${select.stock}`);
      select.stock--;
      console.log(`After: ${select.name} ${select.stock}`);
    }
    this.save();
  },
  handleOutOfStock() {
    console.log("FUUAAAA, out of stock brah");
  }
};

VendingMachine.load();
VendingMachine.takeInput("A3");
