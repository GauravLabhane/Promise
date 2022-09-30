const PromiseByGaurav = require('./index');
function main () {
    return new PromiseByGaurav(function(resolve, reject) {
    setTimeout(function() {
      console.log('1');
      return resolve();
    }, Math.random() * 1000);
    })
    .then(function() {
        return new PromiseByGaurav(function(resolve, reject) {
          setTimeout(function() {
            console.log('2');
            return resolve();
          }, Math.random() * 1000);
        });
      })
      .then(function() {
        return new PromiseByGaurav(function(resolve, reject) {
          setTimeout(function() {
            console.log('3');
            return resolve();
          }, Math.random() * 1000);
        });
      })
      .then(function() {
        return PromiseByGaurav.resolve(4)
      })
      .finally(function() {
        console.log('inside finally');
      })
      .then(function(data) {
        console.log('Skipping Finally block data -- taking data from PromiseByGaurav.resolve() ', data);
        return PromiseByGaurav.reject('throwing custom error in catch using PromiseByGaurav.resolve()');
      })
      .catch(function(err) {
        console.log(err);
        console.error('Oh no! There is an error caught by the catch block');
      });
}
main();
