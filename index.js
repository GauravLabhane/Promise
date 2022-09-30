
class PromiseByGaurav {
    // diffenet states that a promise can hold
    STATE = {
        SUCCESS: 'success',
        REJECTED: 'rejected',
        PENDING: 'pending'
    }
    callbackList = [];
    callbackListOutput = [];
    errorCallbackList = [];
    state = this.STATE.PENDING;
    value = null;
    bindedOnSuccess = this.onSuccess.bind(this);
    bindedOnFailure = this.onFailure.bind(this);
    
    constructor(callback) {
        try {
            callback(this.bindedOnSuccess, this.bindedOnFailure)
        } catch (error) {
            this.onFailure(error);
        }  
    };
    
    onSuccess(value) {
        if(this.state !== this.STATE.PENDING) {
            return;
        }
        if(value instanceof PromiseByGaurav) {
            value.then(this.bindedOnSuccess, this.bindedOnFailure);
            return;
        } 
        this.state = this.STATE.SUCCESS;
        this.value = value;
        this.executeCallbacks();
    }

    onFailure(error) {
        if(this.state !== this.STATE.PENDING) {
            return;
        }
        if(error instanceof PromiseByGaurav) {
            error.then(this.bindedOnSuccess, this.bindedOnFailure);
            return;
        } 
        this.state = this.STATE.REJECTED;
        this.value = error;
        this.executeCallbacks();
    }

    then(success, failure) {
        return new PromiseByGaurav((resolve, reject) => {
            this.callbackList.push(result => {
                if (success == null) {
                  resolve(result)
                  return
                }
                try {
                  resolve(success(result))
                } catch (error) {
                  reject(error)
                }
              })
        
              this.errorCallbackList.push(result => {
                if (failure == null) {
                  reject(result)
                  return
                }
        
                try {
                  resolve(failure(result))
                } catch (error) {
                  reject(error)
                }
              })
        
            this.executeCallbacks();
        });

    }

    catch(callback) {
     this.then(null, callback);
    }
    finally(callback) {
       return this.then((result)=>{
            callback();
            return result;
        })
    }

    executeCallbacks() {
        if(this.state === this.STATE.SUCCESS) {           
            this.callbackList.forEach((callback) => {
                callback(this.value);
            })
            this.callbackList = [];
        } else if (this.state === this.STATE.REJECTED){
            this.errorCallbackList.forEach((callback) => {
                callback(this.value);
            })
            this.errorCallbackList = [];
        }
    }
   static resolve(value) {
        return new PromiseByGaurav((resolve, reject)=> {
            return resolve(value);
        });
    }
   static reject(value) {
    return new PromiseByGaurav((resolve, reject)=> {
        return reject(value);
    });
    }
}

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

module.exports = PromiseByGaurav;
