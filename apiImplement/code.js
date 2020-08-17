Function.prototype.Mybind = function (context, ...args) {
  let self = this;
  let fBound = function (...amArg) {
    return self.call(context, args.concat(amArg));
  }
  return fBound;
}