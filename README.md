# spenmo-api-test-

## Test Scenario to be Automated
The steps are as follows -
1. Login - the user details are in the collection - user the auth token from this response for the next API
2. Get balances - Store the amount in wallet_amount
3. Login to a different user - just the email to be changed - <user_2>(same psw) use the auth token from the response for the next API
4. Get balances of a user - payload -> team -> your_membership_details -> user_wallet -> available_balance - store this value
5. Login with <user_1> - user the auth token from this response for the next API
6. Send funds - the request body is there - store the reference_number  and status should be 200
7. Transactions listing - 
       payload -> transactions -> transaction_number - search for the reference_number in Step 6 in the array of objects
       Once the object for reference number is found, please check isCredit field of that object. 
       If isCredit is 0, past_balance should match the wallet_amount in Step 2.  AND
       payload -> transactions -> available_balance should be equal to past_balance - amount sent in Step 6
       running_balance : org_new_balance and org_prev_balance should be same.
       If isCredit is 1, past_balance should match the amount in Step 4
       payload -> transactions -> available_balance should be equal to past_balance + amount sent in Step 6
8. Login from user - <user_2> use the auth token from the response for the next API
9. Get balances of a user - payload -> team -> your_membership_details -> user_wallet -> available_balance - this amount should be equal to amount stored in Step 4 + amount sent in Step 6

## Steps to run tests
  npm run test

## Configuration for Window Machine 
replace in packege.json with 
              ``` "clean:reports": "rmdir /S /Q mochawesome-report && mkdir mochawesome-report"```

