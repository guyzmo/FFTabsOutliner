var main = require("main");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");

  var root = new main.TNode(null);

  root.add("waf");
  root.add("meaw");
  root.add("waf");
  root.add("coin");

  root.get("coin").add("quack");
  root.get("coin").add("cotcot");
  root.get("coin").add("coocoo");

  root.get("coin").get("coocoo").add("squeak");

  assert.pass(root.has("waf") === true);
  assert.pass(root.has("coin") === true);
  assert.pass(root.has("coocoo") === true);
  assert.pass(root.has("squeak") === false);
  assert.pass(root.get("coocoo").has("squeak") === true);

  //root.print();
  //root.get("coin").print();

};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

require("test").run(exports);
