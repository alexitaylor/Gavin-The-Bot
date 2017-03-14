var _ = require('lodash');

var print = function (arg){
  console.log('testing123' + arg);
}
console.log('test');

print();

_.delay(function(){
  print('adf');
}, 1000);
