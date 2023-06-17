const {Parser} = require("acorn")

// const MyParser = Parser.extend(
//   require("acorn-jsx")(),
//   require("acorn-bigint")
// )

var code = `var hi = "Hello";\nhi = "lol";\nfor (let i = 0; i < 5; i += -1) {\nconsole.log("this is cool");\n}\nvar j = 0;\nwhile (j < 5) {\nj++;\n}`;
var node = Parser.parse(code);
// console.log(node.body)

// example

// loop through all elements in node.body
for (elem of node.body) {
    if (elem.type == "ForStatement" || elem.type == "WhileStatement") {
        

        // var init = elem.init.declarations[0].init.value;
        // console.log(elem.update.right);
        // var step = elem.update.right.value;
        // var cond = elem.test.right.value;
        // // print all three in readable format
        // console.log("init: " + init + ", step: " + step + ", cond: " + cond);
        // if (step == 0 || (cond - init) / step < 0) {
        //     console.log("This loop will never end");
        // }
    } else {
        continue;
    }
}