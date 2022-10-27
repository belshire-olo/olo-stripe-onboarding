import Stripe from "stripe";
import { loadStripe } from '@stripe/stripe-js';

const stripeJS = await loadStripe('***REMOVED***');
const stripe = new Stripe('***REMOVED***', { apiVersion: '2022-08-01'});

let account: Stripe.Account;
let person: Stripe.Person;

async function createAccount() {
    account = await stripe.accounts.create({
        country: 'US',
        type: 'custom',
        business_type: 'company',
        capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true}
        },
        tos_acceptance: {
            date: Date.now(),
            ip: '8.8.8.8'
        },
        business_profile: {
            mcc: '5812',
            url: 'https://www.olotest.com'
        }
    });
}

async function createPerson() {
    stripeJS?.createToken("pii", {
        personal_id_number: '555-55-5555'
    }).then(async (result) => {
        person = await stripe.accounts.createPerson(account.id, {
            first_name: 'Blake',
            last_name: 'Elshire',
            id_number: result.token as unknown as string, // this is Typescript wierdness.
            email: 'blake.elshire@olo.com',
            dob: {
                day: 14,
                month: 1,
                year: 1982
            },
            address: {
                line1: '123 Test St.',
                city: 'NYC',
                state: 'NY',
                postal_code: '10001'
            },
            phone: '555-555-5555',
            ssn_last_4: '5555',
            relationship: {
                title: 'CTO',
                representative: true
            }
        })
    });
    // await stripe.accounts.
}

createAccount();
createPerson();
