
var TNode = function (data) {
    console.log("> TNode("+data+")");
    this.content = data;
    this.children = [];

    this.clear = function () {
        this.content = data;
        this.children = [];
    }
    this.get = function (data) {
        console.log("> TNode.get("+data+")");
        for (var c in this.children)
            c = this.children[c];
            if (c.content === data || c.content === data)
                return c;
        return undefined;
    }
    this.has = function (data) {
        console.log("> TNode.has("+data+")");
        for (var c in this.children)
        return this.get(data) && true || false;
    }
    this.add = function (data) {
        console.log("> TNode.add("+data+")");
        var child = new TNode(data);
        this.children.push(child);
        return child;
    }
    this.del = function (data) {
        console.log("> TNode.del("+data+")");
        var c = this.get(data);
        if (c)
            this.children.splice(this.children.indexOf(c),1);
            return true;
        return false;
    }
    this.toString = function () {
        var out = this.content + ": [";
        for (var c in this.children) {
            c = this.children[c];
            if (typeof(c) == "TNode")
                out += c.toString() + ", " ;
            else
                out += c + ", ";
        }
        return out + "]";
    }
    this.print = function () {
        console.log("TNode("+this.toString()+")");
    }
}

module.exports = TNode;
