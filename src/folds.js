var always = require('ramda/src/always')
var curry = require('ramda/src/curry')
var compose = require('ramda/src/compose')
var of = require('ramda/src/of')
var lift = require('ramda/src/lift')
var _Const = require('./internal/_const')
var monoids = require('./internal/_monoids')

var _getValue = function(x) { return x.value }

var folding = curry(function(toFoldable, toFunctorFn) {
  var traverse_ = curry(function (f, xs) {
    return xs.reduce(function (acc, x) {
      return lift(always)(acc, f(x))
    }, this.of(null))
  })
  return compose(traverse_(toFunctorFn).bind(this), toFoldable)
})

var foldMapOf = curry(function(l, empty, toM, x) {
  var Const = _Const(empty)
  return _getValue(l.call(Const, function(a) {
    return Const(toM(a))
  })(x))
})

// Example folds. Needs monoidal types. Ramda fantasy?
var anyOf = curry(function(l, f, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Any.empty(), compose(monoids.Any, f)))(xs)
})

var sumOf = curry(function(l, xs) {
  return compose(_getValue, foldMapOf(l, monoids.Sum.empty(), monoids.Sum))(xs)
})

var listOf = curry(function(l, xs) {
  return foldMapOf(l, [], of, xs)
})

module.exports = {
  folding: folding,
  foldMapOf: foldMapOf,
  anyOf: anyOf,
  sumOf: sumOf,
  listOf: listOf
}
