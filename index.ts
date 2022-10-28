import Stripe from "stripe";
import * as fs from 'fs';

const stripe = new Stripe('***REMOVED***', { apiVersion: '2022-08-01'});

let account: Stripe.Account;
let representative: Stripe.Person;
let owner: Stripe.Person;
let frontId: Stripe.File;
let backId: Stripe.File;
let frontId2: Stripe.File;
let backId2: Stripe.File;
let externalAccount: Stripe.Response<Stripe.BankAccount | Stripe.Card>;
let piiToken: Stripe.Token;
let piiToken2: Stripe.Token;
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
                line1: 'One World Trade Center',
                line2: '82nd Floor',
                city: 'New York',
                state: 'NY',
                postal_code: '10007',    
                country: 'US'
            },
            phone: '4055964651',
            name: 'OLO Pay Test 1',
            tax_id: '123456789'
        },
        business_profile: {
            mcc: '5812',
            url: 'https://www.olotest.com',
            name: 'OLO Pay Test',
            support_email: 'test@test.com',
            support_phone: '4055964650'
        }
    });
    console.log(account);
}

async function createPIIToken() {
    console.log("Creating PII Tokens");
    piiToken = await stripe.tokens.create({
        pii: {
            id_number: '555555555'
        }
    });
    console.log(piiToken);
    piiToken2 = await stripe.tokens.create({
        pii: {
            id_number: '555555556'
        }
    });
    console.log(piiToken);
}

async function createExternalAccountToken() {
    console.log("Creating external account token");
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
    console.log(externalAccountToken);
}

async function uploadIdDocuments() {
    console.log("Uploading ID Documents");
    const frontFile = fs.readFileSync('fixtures/test-id-front.jpeg');
    const backFile = fs.readFileSync('fixtures/test-id-back.png');

    frontId = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: frontFile,
            name: 'test-id-front.jpeg',
            type: 'application/octet-stream',
        },
    });
    console.log(frontId);

    backId = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: backFile,
            name: 'test-id-back.png',
            type: 'application/octet-stream',
        },
    })
    console.log(backId);

    frontId2 = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: frontFile,
            name: 'test-id-front.jpeg',
            type: 'application/octet-stream',
        },
    });
    console.log(frontId2);

    backId2 = await stripe.files.create({
        purpose: 'identity_document',
        file: {
            data: backFile,
            name: 'test-id-back.png',
            type: 'application/octet-stream',
        },
    })
    console.log(backId2);
}

async function createRepresentative() {
    console.log('creating representative');
    representative = await stripe.accounts.createPerson(account.id, {
        first_name: 'Blake',
        last_name: 'Elshire',
        email: 'blake.elshire@olo.com',
        id_number: piiToken2.id,
        dob: {
            day: 14,
            month: 1,
            year: 1982
        },
        address: {
            line1: 'One World Trade Center',
            line2: '82nd Floor',
            city: 'New York',
            state: 'NY',
            postal_code: '10007'
        },
        phone: '555-555-5555',
        ssn_last_4: '5555',
        relationship: {
            title: 'CTO',
            representative: true,
            executive: true
        },
        verification: {
            document: {
                front: frontId.id,
                back: backId.id
            }
        }
    });
    console.log(representative);
}

async function createOwner() {
    console.log('creating owner');
    owner = await stripe.accounts.createPerson(account.id, {
        first_name: 'Erik',
        last_name: 'Parker',
        email: 'erik.parker@olo.com',
        id_number: piiToken.id,
        dob: {
            day: 14,
            month: 1,
            year: 1982
        },
        address: {
            line1: 'One World Trade Center',
            line2: '82nd Floor',
            city: 'New York',
            state: 'NY',
            postal_code: '10007'
        },
        phone: '555-555-5555',
        ssn_last_4: '5555',
        relationship: {
            title: 'ceo',
            owner: true,
            executive: true,
            percent_ownership: 50
        },
        verification: {
            document: {
                front: frontId2.id,
                back: backId2.id
            }
        }
    });
    console.log(owner);
}

async function createExternalAccount() {
    console.log("Creating External Account");
    externalAccount = await stripe.accounts.createExternalAccount(account.id, {
        external_account: externalAccountToken.id
    })
    console.log(externalAccount);
}

async function updateOwnership() {
    await stripe.accounts.update(account.id, {
        company: {
            owners_provided: true,
            ownership_declaration: {
                date: 1666899261,
                ip: '8.8.8.8'
            }
        }
    });
}

async function main() {
    // Create connected account scaffold with any info we have
    await createAccount();
    
    // Generate tokens for PII
    await createPIIToken();
    
    // Generate token for Bank Account
    await createExternalAccountToken();
    
    // Upload any ID documents collected
    await uploadIdDocuments();

    // Create a representative attached to the connected account
    await createRepresentative();

    // Create an owner representative attached to the connected account
    await createOwner();

    // Attach external account token to the connected account
    await createExternalAccount();

    // Update the base account saying we have collected ownership information
    await updateOwnership();

    const final_account = await stripe.accounts.retrieve(account.id)
    console.log(final_account);
}

main();