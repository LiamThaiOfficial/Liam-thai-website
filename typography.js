const { SplitText } = require("gsap/all");

gsap.registerPlugin(SplitText);

let split = new SplitText("text", "lines", "chars", "words", "links", {

}).