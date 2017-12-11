var events = require('event');
var emitter = require('emitter');
var k = require('k')(window);

module.exports = onoff;

/*global document*/

function onoff(selectors) {
  var self = {}, my = {
    className: 'hidden'
  };

  function check(name, e) {
    var veto;
    self.emit(name, e, my.el, function() {
      veto = true;
    });
    return !veto;
  }

  function close(e) {
    var cl = my.el.classList;
    if (cl.contains(my.className)) {
      // alredy closed
      return;
    }
    if (!check('closing', e)) {
      return self;
    }
    events.unbind(document, 'click', close);
    k.unbind();
    cl.add(my.className);
    return self;
  }

  function open(e) {
    var cl = my.el.classList;
    if (!cl.contains(my.className)) {
      return;
    }
    if (!check('opening', e)) {
      return self;
    }
    cl.remove(my.className);
    events.bind(document, 'click', close);
    k.bind('esc', close);
    return self;
  }

  function opening(e) {
    e.stopPropagation();
    e.preventDefault();
    open(e);
  }

  my.el = document.querySelector(selectors.popup);
  if (selectors.trigger) {
    events.bind(document.querySelector(selectors.trigger), 'click', opening);
  }
  if (selectors.event) {
    events.bind(window, selectors.event, opening);
  }
  events.bind(my.el.querySelector('.close'), 'click', close);

  self.open = open;
  self.close = close;

  emitter(self);

  return self;
}
