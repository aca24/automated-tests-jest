const request = require('supertest');
const app = require("../app");
var randomEmail = require('random-email');
const { getBodyRequest } = require("../helpers/restAPIBodyRequest");
const { NAME, NEW_NAME, PASSWORD, INVALID_USER_ID } = require('../helpers/constants');


describe('User test suite', () => {

    test("Should get all users successfully", async () => {
        const response = await request(app)
            .get(`/user/getAllUsers`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    test("Should get a user successfully", async () => {
        const EMAIL = randomEmail({ domain: 'gmail.com' });
        const requestBody = getBodyRequest(NAME, EMAIL, PASSWORD);

        const res = await request(app)
            .post(`/user/addUser`)
            .send(requestBody)
            .set('Accept', 'application/json');

        const userId = res.body.id;

        const response = await request(app)
            .get(`/user/getUser/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.name).toStrictEqual(NAME);
        expect(response.body.data.email).toStrictEqual(EMAIL);
    });

    test("Should create a new user successfully", async () => {
        const EMAIL = randomEmail({ domain: 'gmail.com' });
        const requestBody = getBodyRequest(NAME, EMAIL, PASSWORD);

        const res = await request(app)
            .post(`/user/addUser`)
            .send(requestBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);

        expect(res.body.data.name).toStrictEqual(NAME);
        expect(res.body.data.email).toStrictEqual(EMAIL);
    });

    test("Should update a user successfully", async () => {
        const EMAIL = randomEmail({ domain: 'gmail.com' });
        const requestBody = getBodyRequest(NAME, EMAIL, PASSWORD);
        
        const res = await request(app)
            .post(`/user/addUser`)
            .send(requestBody)
            .set('Accept', 'application/json');

        const userId = res.body.id;

        const newRequestBody = getBodyRequest(NEW_NAME, EMAIL, PASSWORD);

        const response = await request(app)
            .patch(`/user/updateUser/${userId}`)
            .send(newRequestBody)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.data.name).toStrictEqual(newRequestBody.name);
        expect(response.body.data.email).toStrictEqual(newRequestBody.email);
    });

    test("Should delete a user successfully", async () => {
        const EMAIL = randomEmail({ domain: 'gmail.com' });
        const requestBody = getBodyRequest(NAME, EMAIL, PASSWORD);

        const res = await request(app)
            .post(`/user/addUser`)
            .send(requestBody)
            .set('Accept', 'application/json');

        const userId = res.body.id;

        const response = await request(app)
            .delete(`/user/deleteUser/${userId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        const responseForGet = await request(app)
            .get(`/user/getUser/${userId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(responseForGet.statusCode).toBe(404);
        expect(responseForGet.body).toEqual("User doesn't find!");
    });

    test("Shouldn't get a user, because id of user doesn't exist", async () => {
        const response = await request(app)
            .get(`/user/getUser/${INVALID_USER_ID}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual("User doesn't find!");
    });

});