prompt = require('prompt');
prompt.start();


var _userdb = {
  "xx": {
    "pin": 3848,
    "balance" : 500
  },
  "2": {
    "pin": 8373,
    "balance" : 1000
  },
  "3": {
    "pin": 1234,
    "balance" : 50
  }
};
var _userID = null;
var _action = null;
var _incorrectPinCount = null;
var _pinAttemptsRemaining = 3;
var _pinIsCorrect = null;
var _withdrawal = null;
var _withdrawalDiff = null;
var _balance = null;
var _deposit = null;

var startBank = function() {
  prompt.get(['user'], function(err, result) {
  _userID = result.user;
    if  (_userdb.hasOwnProperty(_userID)) {

      console.log("please enter your PIN");
      var getPin =  function() {
        prompt.get(['pin'], function(err, pinResult) {

          if (parseInt(pinResult.pin, 10) === _userdb[_userID]["pin"]) {
            var bankActions = function() {
              var anotherAction = function() {
                console.log("do you want to perform another action? (Y/N)");
                prompt.get(['moreActions'], function(err, moreActionsResult){
                  if (moreActionsResult.moreActions.toUpperCase() === 'Y') {
                    bankActions();
                  } else {
                  }
                })
              };

             _balance =_userdb[_userID]["balance"];
            console.log('What action do you want to perform?');
            console.log('Enter 1 to view balance');
            console.log('Enter 2 to withdraw money');
            console.log('Enter 3 to deposit money');
            console.log('Enter 4 to exit bank');
            prompt.get(['action'], function(err, actionResult) {
              _action = parseInt(actionResult.action, 10);
              switch (_action) {
                case 1:
                  console.log("Your balance is " + _balance);
                  anotherAction();
                  break;
                case 2:
                  console.log("Your balance is " + _balance + ", how much do you want to withdraw?");
                  var withdrawalFunc = function() {
                      var confirmWithdrwal = function() {
                      console.log("You have withdrawn " + _withdrawal);
                      _userdb[_userID]["balance"] = _userdb[_userID]["balance"] - _withdrawal;
                      anotherAction();
                      };

                      prompt.get('withdrawalAmount', function(err, waResult) {
                      _withdrawal = parseInt(waResult.withdrawalAmount, 10);
                      _withdrawalDiff = _withdrawal % 5
                      if (_withdrawalDiff !== 0) {
                        console.log("we can only produce denominations of 5, would you like " + (_withdrawal - _withdrawalDiff) + " or " + (_withdrawal + 5 - _withdrawalDiff) + "?")
                        withdrawalFunc();
                      } else {
                        if (_balance - _withdrawal < 0 ) {
                          console.log("You can only withdraw " + _balance + ", do you want to withdraw this much? (Y/N)");
                          prompt.get(['confirm'], function(err, maxWithdrawalResult) {
                            if (maxWithdrawalResult.confirm.toUpperCase() === "Y") {
                              _withdrawal = _balance;
                              confirmWithdrwal();
                            } else if (maxWithdrawalResult.confirm.toUpperCase() === "N") {
                              console.log("How much would you like to withdraw?");
                              withdrawalFunc();
                            }
                          })
                        } else {
                          confirmWithdrwal();
                        }
                      }

                      });
                  };
                  withdrawalFunc();
                  break;
                case 3:
                  var confirmDeposit = function() {
                  console.log("You have deposited " + _deposit);
                  _userdb[_userID]["balance"] = _userdb[_userID]["balance"] + _deposit;
                  anotherAction();
                  };

                  console.log("How much would you like to deposit?")
                  prompt.get('depositAmount', function(err, daResult) {
                    _deposit = parseInt(daResult.depositAmount, 10)
                    confirmDeposit();
                  })
                  break;
                case 4:
                  break;


              };


            })

            };

            bankActions();
          } else {
            if (_pinAttemptsRemaining === 1) {
              _pinIsCorrect = false;
              console.log("Your account is suspended (not)");
            } else {
            _pinIsCorrect = false;
            _incorrectPinCount += 1;
            _pinAttemptsRemaining -= 1;
            console.log("pin is incorrect, you have " + _pinAttemptsRemaining + " attempts remaining.");
            getPin();
            }
          }
      })};
      getPin();


    } else {
      console.log("User does not exist");
    }

  })
};
startBank();
