import Stripe from "stripe";
import fs from 'fs';

const stripe = new Stripe('***REMOVED***', { apiVersion: '2022-08-01'});

let account: Stripe.Account;
let person: Stripe.Person;
let frontID: Stripe.File;
let backId: Stripe.File;
let externalAccount: Stripe.Response<Stripe.BankAccount | Stripe.Card>;
let piiToken: Stripe.Token;
let externalAccountToken: Stripe.Token;

async function createAccount() {
    console.log('creating account');
    account = await stripe.accounts.create({
        country: 'US',
        type: 'custom',
        business_type: 'company',
        capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true}
        },
        tos_acceptance: {
            date: 1666899261, // Can't use Date.now() for some reason
            ip: '8.8.8.8'
        },
        company: {
            address: {
                line1: '1 World Trade Center, 82nd Floor',
                line2: '285 Fulton Street',
                city: 'New York',
                state: 'NY',
                postal_code: '10007',    
                country: 'US'
            },
            phone: '4055964651',
            name: 'OLO Restaurant 1',
            tax_id: '123456789'
        },
        business_profile: {
            mcc: '5812',
            url: 'https://www.olotest.com',
            name: 'OLO Restaurant',
            support_email: 'test@test.com',
            support_phone: '4055964650'
        }
    });
    console.log(account);
}

async function createPIIToken() {
    piiToken = await stripe.tokens.create({
        pii: {
            id_number: '555555555'
        }
    });
}

async function createExternalAccountToken() {
    externalAccountToken = await stripe.tokens.create({
        bank_account: {
            country: 'US',
            currency: 'usd',
            account_holder_name: 'Jenny Rosen',
            account_holder_type: 'company',
            routing_number: '110000000',
            account_number: '000123456789',
        }
    })
}

async function uploadIdDocuments() {
    const frontFile = fs.readFileSync('fixtures/test-id-front.jpeg');
    const backFile = fs.readFileSync('fixtures/test-id-back.png');

    frontID = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: frontFile,
            name: 'test-id-front.jpeg',
            type: 'application/octet-stream',
        },
    });

    backId = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: backFile,
            name: 'test-id-back.png',
            type: 'application/octet-stream',
        },
    })
}

async function createPerson() {
    console.log('creating pii token');

    console.log(piiToken);
    console.log('creating person');
    person = await stripe.accounts.createPerson(account.id, {
        first_name: 'Blake',
        last_name: 'Elshire',
        email: 'blake.elshire@olo.com',
        id_number: piiToken.id,
        dob: {
            day: 14,
            month: 1,
            year: 1982
        },
        address: {
            line1: '1 World Trade Center, 82nd Floor',
            line2: '285 Fulton Street',
            city: 'New York',
            state: 'NY',
            postal_code: '10007'
        },
        phone: '555-555-5555',
        ssn_last_4: '5555',
        relationship: {
            title: 'CTO',
            representative: true
        },
        verification: {
            document: {
                front: frontID.id,
                back: backId.id
            }
        }
    });
    console.log(person);
}

async function createExternalAccount() {
    externalAccount = await stripe.accounts.createExternalAccount(account.id, {
        external_account: externalAccountToken.id
    })
}

async function main() {
    await createAccount();
    await createPIIToken();
    await createExternalAccountToken();
    await uploadIdDocuments();
    await createPerson();
    await createExternalAccount();
}

main();