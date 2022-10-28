"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var stripe_1 = require("stripe");
var fs = require("fs");
var stripe = new stripe_1["default"]('***REMOVED***', { apiVersion: '2022-08-01' });
var account;
var representative;
var owner;
var frontId;
var backId;
var frontId2;
var backId2;
var externalAccount;
var piiToken;
var piiToken2;
var externalAccountToken;
function createAccount() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('creating account');
                    return [4 /*yield*/, stripe.accounts.create({
                            country: 'US',
                            type: 'custom',
                            business_type: 'company',
                            capabilities: {
                                card_payments: { requested: true },
                                transfers: { requested: true }
                            },
                            tos_acceptance: {
                                date: 1666899261,
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
                        })];
                case 1:
                    account = _a.sent();
                    console.log(account);
                    return [2 /*return*/];
            }
        });
    });
}
function createPIIToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating PII Tokens");
                    return [4 /*yield*/, stripe.tokens.create({
                            pii: {
                                id_number: '555555555'
                            }
                        })];
                case 1:
                    piiToken = _a.sent();
                    console.log(piiToken);
                    return [4 /*yield*/, stripe.tokens.create({
                            pii: {
                                id_number: '555555556'
                            }
                        })];
                case 2:
                    piiToken2 = _a.sent();
                    console.log(piiToken);
                    return [2 /*return*/];
            }
        });
    });
}
function createExternalAccountToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating external account token");
                    return [4 /*yield*/, stripe.tokens.create({
                            bank_account: {
                                country: 'US',
                                currency: 'usd',
                                account_holder_name: 'Jenny Rosen',
                                account_holder_type: 'company',
                                routing_number: '110000000',
                                account_number: '000123456789'
                            }
                        })];
                case 1:
                    externalAccountToken = _a.sent();
                    console.log(externalAccountToken);
                    return [2 /*return*/];
            }
        });
    });
}
function uploadIdDocuments() {
    return __awaiter(this, void 0, void 0, function () {
        var frontFile, backFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Uploading ID Documents");
                    frontFile = fs.readFileSync('fixtures/test-id-front.jpeg');
                    backFile = fs.readFileSync('fixtures/test-id-back.png');
                    return [4 /*yield*/, stripe.files.create({
                            purpose: 'identity_document',
                            file: {
                                data: frontFile,
                                name: 'test-id-front.jpeg',
                                type: 'application/octet-stream'
                            }
                        })];
                case 1:
                    frontId = _a.sent();
                    console.log(frontId);
                    return [4 /*yield*/, stripe.files.create({
                            purpose: 'identity_document',
                            file: {
                                data: backFile,
                                name: 'test-id-back.png',
                                type: 'application/octet-stream'
                            }
                        })];
                case 2:
                    backId = _a.sent();
                    console.log(backId);
                    return [4 /*yield*/, stripe.files.create({
                            purpose: 'identity_document',
                            file: {
                                data: frontFile,
                                name: 'test-id-front.jpeg',
                                type: 'application/octet-stream'
                            }
                        })];
                case 3:
                    frontId2 = _a.sent();
                    console.log(frontId2);
                    return [4 /*yield*/, stripe.files.create({
                            purpose: 'identity_document',
                            file: {
                                data: backFile,
                                name: 'test-id-back.png',
                                type: 'application/octet-stream'
                            }
                        })];
                case 4:
                    backId2 = _a.sent();
                    console.log(backId2);
                    return [2 /*return*/];
            }
        });
    });
}
function createRepresentative() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('creating representative');
                    return [4 /*yield*/, stripe.accounts.createPerson(account.id, {
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
                        })];
                case 1:
                    representative = _a.sent();
                    console.log(representative);
                    return [2 /*return*/];
            }
        });
    });
}
function createOwner() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('creating owner');
                    return [4 /*yield*/, stripe.accounts.createPerson(account.id, {
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
                        })];
                case 1:
                    owner = _a.sent();
                    console.log(owner);
                    return [2 /*return*/];
            }
        });
    });
}
function createExternalAccount() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating External Account");
                    return [4 /*yield*/, stripe.accounts.createExternalAccount(account.id, {
                            external_account: externalAccountToken.id
                        })];
                case 1:
                    externalAccount = _a.sent();
                    console.log(externalAccount);
                    return [2 /*return*/];
            }
        });
    });
}
function updateOwnership() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stripe.accounts.update(account.id, {
                        company: {
                            owners_provided: true,
                            ownership_declaration: {
                                date: 1666899261,
                                ip: '8.8.8.8'
                            }
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var final_account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Create connected account scaffold with any info we have
                return [4 /*yield*/, createAccount()];
                case 1:
                    // Create connected account scaffold with any info we have
                    _a.sent();
                    // Generate tokens for PII
                    return [4 /*yield*/, createPIIToken()];
                case 2:
                    // Generate tokens for PII
                    _a.sent();
                    // Generate token for Bank Account
                    return [4 /*yield*/, createExternalAccountToken()];
                case 3:
                    // Generate token for Bank Account
                    _a.sent();
                    // Upload any ID documents collected
                    return [4 /*yield*/, uploadIdDocuments()];
                case 4:
                    // Upload any ID documents collected
                    _a.sent();
                    // Create a representative attached to the connected account
                    return [4 /*yield*/, createRepresentative()];
                case 5:
                    // Create a representative attached to the connected account
                    _a.sent();
                    // Create an owner representative attached to the connected account
                    return [4 /*yield*/, createOwner()];
                case 6:
                    // Create an owner representative attached to the connected account
                    _a.sent();
                    // Attach external account token to the connected account
                    return [4 /*yield*/, createExternalAccount()];
                case 7:
                    // Attach external account token to the connected account
                    _a.sent();
                    // Update the base account saying we have collected ownership information
                    return [4 /*yield*/, updateOwnership()];
                case 8:
                    // Update the base account saying we have collected ownership information
                    _a.sent();
                    return [4 /*yield*/, stripe.accounts.retrieve(account.id)];
                case 9:
                    final_account = _a.sent();
                    console.log(final_account);
                    return [2 /*return*/];
            }
        });
    });
}
main();
