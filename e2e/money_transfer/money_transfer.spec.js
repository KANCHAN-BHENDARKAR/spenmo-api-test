
const expect = require("chai").expect;
const addContext = require('mochawesome/addContext');
const supertest = require('supertest');
const config = require('../support/config');
const endpoint = config.BASE_URL + config.CONTEXT
const request = supertest(endpoint)
const credentials = require('../support/loginDetails');


describe('Validate Money Trasfer', async function () {
    let ACESS_TOKEN_USER_1_EMAIL_ID
    let ACESS_TOKEN_USER_2_EMAIL_ID
    let WALLET_AMOUNT
    let REFERENCE_NUMBER
    let AVAILABLE_BALANCE
    let AVAILABLE_BALANCE_UPDATED
    let AMOUNT = "1"
    it('Login with Sender Credentials', async function () {

        const formData = {
            "email": credentials.USER_1_EMAIL_ID,
            "password": credentials.USER_1_PASSWORD,
            "device": "portal"
        }

        const response = await request.post(config.LOGIN_URI)
            .type('form-data')
            .send(formData);


        expect(response.status).to.eql(200);

        ACESS_TOKEN_USER_1_EMAIL_ID = response.body.payload.access_token
        console.log("access token found  : " + ACESS_TOKEN_USER_1_EMAIL_ID)
        console.log("response : " + JSON.stringify(response.body))
        addContext(this, { title: 'Response', value: response.body })
    }
    );

    it("Get Sender Balance", async function () {

        console.log("check access token :" + ACESS_TOKEN_USER_1_EMAIL_ID)

        headers = {
            "authorization": "Bearer " + ACESS_TOKEN_USER_1_EMAIL_ID,
            "access": "application/json",
            "origin": "https://dashboard.spenmo-staging.com",
            "referer": "https://dashboard.spenmo-staging.com/",
            "authority": "api.spenmo-staging.com"
        }

        const response = await request.get("/org/f33ee556-86e6-11eb-9d9d-0242ac110003/team/f341412a-86e6-11eb-b045-0242ac110003")
            .set(headers)

        WALLET_AMOUNT = response.body.payload.team.wallet_amount

        console.log("Response for Sender  balance : " + JSON.stringify(response))
        console.log("Wallet Amount  is : " + WALLET_AMOUNT)
        addContext(this, { title: 'Response for Sender  balance ', value: response.body })
    }
    );

    it('Login with Receiver Credential', async function () {

        const formData = {
            "email": credentials.USER_2_EMAIL_ID,
            "password": credentials.USER_2_PASSWORD,
            "device": "portal"
        }

        const response = await request.post(config.LOGIN_URI)
            .type('form-data')
            .send(formData);


        expect(response.status).to.eql(200);

        ACESS_TOKEN_USER_2_EMAIL_ID = response.body.payload.access_token
        console.log("access token found  : " + ACESS_TOKEN_USER_2_EMAIL_ID)
        console.log("response : " + JSON.stringify(response.body))
        addContext(this, { title: 'Response', value: response.body })
    }
    );

    it("Get Receiver Balance", async function () {

        console.log("check access token :" + ACESS_TOKEN_USER_2_EMAIL_ID)

        headers = {
            "authorization": "Bearer " + ACESS_TOKEN_USER_2_EMAIL_ID,
            "access": "application/json",
            "origin": "https://dashboard.spenmo-staging.com",
            "referer": "https://dashboard.spenmo-staging.com/",
            "authority": "api.spenmo-staging.com"
        }

        const response = await request.get("/org/f33ee556-86e6-11eb-9d9d-0242ac110003/team/f341412a-86e6-11eb-b045-0242ac110003")
            .set(headers)

        AVAILABLE_BALANCE = response.body.payload.team.your_membership_details.user_wallet.available_balance
        console.log("Response for Sender  balance : " + JSON.stringify(response))
        console.log("Available Balance  is : " + AVAILABLE_BALANCE)
        addContext(this, { title: 'Response for Sender  balance ', value: response.body })
    }
    )

    it('Sender Send Money to Receiver ', async function () {

        const formData = {
            "amount": JSON.stringify({ "to_amount": AMOUNT, "to_currency": "SGD", "from_amount": AMOUNT, "from_currency": "SGD", "fee": 0 }),
            "sender": JSON.stringify({ "team_id": "f341412a-86e6-11eb-b045-0242ac110003", "type": "team" }),
            "receiver": JSON.stringify({ "team_id": "f341412a-86e6-11eb-b045-0242ac110003", "user_id": "e460d858-96d3-11eb-96f7-0242ac110003", "type": "user" }),
            "organisation_id": "f33ee556-86e6-11eb-9d9d-0242ac110003"
        }

        headers = {
            "authorization": "Bearer " + ACESS_TOKEN_USER_1_EMAIL_ID,
            "access": "application/json",
        }
        //https://api.spenmo-staging.com/api/v1/fund/send
        const response = await request.post(config.SEND_FUND_URI)
            .type('form-data')
            .set(headers)
            .send(formData);


        expect(response.status).to.eql(200);


        REFERENCE_NUMBER = response.body.payload.reference_number

        console.log("response : " + JSON.stringify(response.body))
        addContext(this, { title: 'Response', value: response.body })
        console.log("reference Number is  found  : " + REFERENCE_NUMBER)
    }
    );

    it('Get All Transaction Details ', async function () {
        this.timeout(180000)
        const formData = {
            "fields": JSON.stringify({ "transaction_number": "true", "amount": "true", "past_balance": "true", "available_balance": "true", "user_id": "true", "organisation_id": "true", "created_at": "true", "type": "true", "description": "true", "vendor_transaction_id": "true", "merchant": "true", "card_type": "true", "card_last_four": "true", "foreign_currency_amount": "true", "foreign_currency_code": "true", "vendor_fee_amount": "true", "subwallet_id": "true", "team_id": "true", "receipts": "true", "category": "true", "running_balance": "true" }),
            "filters": JSON.stringify({ "organisation_id": "f33ee556-86e6-11eb-9d9d-0242ac110003" }),
            "organisation_id": "f33ee556-86e6-11eb-9d9d-0242ac110003"
        }

        headers = {
            "authorization": "Bearer " + ACESS_TOKEN_USER_1_EMAIL_ID,
            "access": "application/json",
        }
        const response = await request.post(config.TRANSACTIONS_URI)
            .type('form-data')
            .set(headers)
            .send(formData);


        expect(response.status).to.eql(200);

        let list = response.body.payload.transactions

        if (REFERENCE_NUMBER == (list[0].transaction_number)) {
            expect(list[0].past_balance).to.eql(WALLET_AMOUNT)
            expect(list[1].past_balance).to.eql(AVAILABLE_BALANCE)
            expect(list[0].running_balance.org_new_balance).to.eql(list[0].running_balance.org_new_balance)
            expect(list[1].running_balance.org_new_balance).to.eql(list[1].running_balance.org_new_balance);
        }

        //addContext(this, { title: 'Response', value: response.body })

    }
    );

    it("Verify Received Fund ", async function () {

        console.log("check access token :" + ACESS_TOKEN_USER_2_EMAIL_ID)

        headers = {
            "authorization": "Bearer " + ACESS_TOKEN_USER_2_EMAIL_ID,
            "access": "application/json",
            "origin": "https://dashboard.spenmo-staging.com",
            "referer": "https://dashboard.spenmo-staging.com/",
            "authority": "api.spenmo-staging.com"
        }

        const response = await request.get("/org/f33ee556-86e6-11eb-9d9d-0242ac110003/team/f341412a-86e6-11eb-b045-0242ac110003")
            .set(headers)

        AVAILABLE_BALANCE_UPDATED = response.body.payload.team.your_membership_details.user_wallet.available_balance

        expect(parseFloat(AVAILABLE_BALANCE_UPDATED)).to.eql(parseFloat(AMOUNT) + parseFloat(AVAILABLE_BALANCE))

        console.log("Response for Sender  balance : " + JSON.stringify(response))
        console.log("Updated Available Balance  is : " + AVAILABLE_BALANCE_UPDATED)
        addContext(this, { title: 'Response for Sender  balance ', value: response.body })
    }
    )

});


