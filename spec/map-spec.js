if(!_ && typeof require === "function") {
	var _ = require('../jive.js');
}

describe("Map.js is a class to polyfill the upcoming Map type in ES6", function() {
	it("sets up a global constructor _.Map", function() {
		expect(_.Map).not.toEqual(undefined);
		expect(_.Map).toBeTruthy();
	});

	describe("it exposes a similar functional API to the proposed ES6 Map Object", function() {
		it("has a set function which sets things into the map by the key", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.find(key).val).toEqual("lalala");
		});

		it("has a find function which can find things in the map by the key, this one should be really hidden in the real implementation", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.find(key).val).toEqual("lalala");
		});

		it("has a get function which can get things in the map by the key", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.get(key)).toEqual("lalala");
		});

		it("has a 'has' function which can tell you whether the map contains that key", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.has(key)).toBeTruthy();
		});

		it("has a toJSON function which kinda prints out the map", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.toJSON()[0].val).toEqual("lalala");
			expect(_.isArray(map.toJSON())).toBeTruthy();
			expect(map.toJSON().length).toEqual(1);
		});

		it("has a size function which tells you the size of the map", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.size()).toEqual(1);

			map.set(1, "lalala");
			expect(map.size()).toEqual(2);
		});

		it("has a delete function to remove keys from the map", function() {
			var key = {foo:"bar"};
			var map = new _.Map();

			map.set(key, "lalala");
			expect(map.size()).toEqual(1);
			
			map.set(1, "lalala");
			expect(map.size()).toEqual(2);
			
			map.delete(key);
			expect(map.size()).toEqual(1);
		});

		it("can be newed up with seed data in the constructor", function() {
			var arr = [{foo:"bar"}, {bar:"baz"}]
			var map = new _.Map(arr);
			expect(map.size()).toEqual(2);
			expect(map.get("foo")).toEqual("bar");

			var obj = {foo:"bar", buz:"baz"}
			var map = new _.Map(obj);
			expect(map.size()).toEqual(2);
			expect(map.get("foo")).toEqual("bar");
		});

		it('has its own toString override for easy detection', function() {
			var map = new _.Map();
			expect(map.toString()).toEqual("[object Map]");
		})

	});
	
	
});

