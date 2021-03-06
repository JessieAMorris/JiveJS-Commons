JiveJS-Commons
==============

Common low level libraries created to support the higher level application frameworks and programming patterns.
* [Capped](#_cappedsize-rotate-seed)
* [Promise](#promise)
* [State](#state)
* [Fabric](#fabric)

# _.Capped({size, rotate}, [seed])
## Description
An array like object defined on the global _ that provides a way to set a maximum size. If you use the push operator, the size will never exceed the maximum specified.

Paramater | Type | Example | Description
--- | --- | --- | ---
size | Key-Value | ``size: 10`` | A key-value pair for the maximum size of the array
roate | Key-Value | ``rotate: true`` | A key-value pair for whether or not you want to have the array automatically pop items off the front of the array when its size exceeds the maximum size. <b>Default:</b> ``true``, when ``false`` it will ignore any additions to the array once full. 
seed | Array | ``['a', 'b', 'c', 'd']`` | If a seed is provided, the capped array will be populated with the elements of the seed array, exactly like the Array constructor.

```
var capped = new _.Capped({ size: 5, roate: true}, [1,2,3,4,5]);

capped; // [1, 2, 3, 4, 5]

for(var i = 5; i < 10; i++) {
	capped.push(i);
}

capped.length; // 5
capped; // [5, 6, 7, 8, 9]
```

# State
## A library grown out of that exposes a Finite State Machine
Idem to Promise on the browser compatability and the future timeline.  This baby grew out of the realization that promises and deferred specs are really just artificially handicapped state machines.  They impose an artificial limitation on the amount of states and on the transfer from state to state.  Removing these gives us State.js
### Example

```
//Stashes on the global _ on the property State...
//The closure also returns the State constructor and could be munged to work in AMD/Common if we gave a...

//you construct it up with the states it contains
var state = new _.State({
  initState: "start",
  states: ["start", "middle", "end", "dead"]
})

//but you can modify the states later if you need to.
state.addStates(["another", "extra", "state"]);
state.removeStates(["extra", "state"]);

//you can query the states that exist
console.log(state.getStates());

//as well as the current state
console.log(state.state());

//you can bind to state change events:
state.on("middle", function(data) { console.log("middle enter", data)}, "enter");
state.on("middle", function(data) { console.log("middle on", data)}, "on");
state.on("middle", function(data) { console.log("middle leave", data)}, "leave");

state.go("middle", "foo");

//expectes in console
// ... the state stuff but that is boring
// ... here the go stuff
// "middle enter", {leavingState: "start", enteringState:"middle", data:"foo"}
// "middle on", {leavingState: "start", enteringState:"middle", data:"foo"}

//there also exists an "all" state event in case you are neurotic and like writing tons of if/switchs in callbakcs
state.on("all", function(data) {console.log("all on", data)}, "on");

```

### Notes
* you can always query the state as shown if you want to just check
* but the main usage would be callbacks that are bound to specific state events
* What you want to do with these state things is your own concern
* and if you have functions that should react differently based on state, then those functions should query the state and handle themselves differently.

# Fabric
## A library exposing a pub/sub - commande/notify - request/response - and enqueue/peek/handle/release API
Idem on the browser support... catching a pattern yet?  This beauty exposes a message hub/bus/fabric in the client and exposes the API's you'd want for interacting with it.  We elected for a "URI/URN" type method of binding and publishing as opposed to "channel/topic" paradigm... which is really just opinion but fits better in our system.  That plus some AMPQ type wildcard bindings with * and # and you have some fun.
### Example

```
//fabric is a global, we might move it to be on the _ namespace but for now its easy to new up
var fabric = new Fabric();

//basic usage is pretty easy:
fabric.subscribe({
  "urn": "this:is:my:urn",
  "callback": function(data) { console.log(data) }
});

// * is a single "word" wildcard, # is a multi "word" wildcard
fabric.subscribe({
  "urn": "this:is:*:urn",
  "callback": function(data) { console.log(data) }
});

fabric.subscribe({
  "urn": "this:is:#",
  "callback": function(data) { console.log(data) }
});

fabric.publish({
  "urn": "this:is:my:urn",
  data: { "foo":"bar"}
});

//expects:
// {
//  raw: {urn: "this:is:my:urn"},
//  matches: ["this", "is", "my", "urn"],
//  data: {foo:"bar"}
// }

// {
//  raw: {urn: "this:is:my:urn"},
//  matches: ["this", "is", "my", "urn"],
//  data: {foo:"bar"}
// }

// {
//  raw: {urn: "this:is:my:urn"},
//  matches: ["this", "is", "my urn"],
//  data: {foo:"bar"}
// }

//request/fulfil and command/notify are really just semantic abstractions
fabric.subscribe({
  urn: "request:urn",
  callback: function(data) {
    fabric.fulfill({
      urn: data.cbUrn,
      data: "blah"
    });
  }
});

fabric.request({
  urn: "request:urn",
  callback: function(data) {
    console.log(data);
  }
});

fabric.subscribe({
  urn: "command:urn",
  callback: function(data) {
    fabric.notify({
      urn: data.cbUrn,
      data: "blah"
    });
  }
});

fabric.command({
  urn: "command:urn",
  callback: function(data) {
    console.log(data);
  }
});

//queue is where it gets a little different
fabric.enqueue({
  urn: "queue:urn",
  data: {"foo": "bar"}
});

fabric.peek({
  urn:"queue:*",
  callback: function(data) {
    console.log(data);
    fabric.handle({key:data.key})
  }
});

fabric.enqueue({
  urn: "queue:OtherUrn",
  data: {"foo": "bar"}
});

fabric.peek({
  urn:"queue:*",
  callback: function(data) {
    console.log(data);
    fabric.release({key:data.key})
  }
});


```

### Notes
* This sucker is fairly robust, it doesn't use promises at the moment but that is something we are considering so that the methods of subscribe etc would return a promise that would be fulfilled instead of taking a callback, but for now they are independant libs
* This sucker is crazy fast behind the scenes and doesn't store any references to scope objects so no scope leak zombies
* if you need a callback to be executed in a specific "scope" then you need to bind it or fucntion factory it before you call the fabric methods
