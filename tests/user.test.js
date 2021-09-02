const request = require('supertest');
const app = require('../routes/index');
const Mongo = require('../loader/mongoDB');

describe(' API', () => {

    it('POST /register  -> create new user', () => {
        return request(app).post('/register')
            .send({
                "name": "reza",
                "email": "rEzamasoomi.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: {
                                _id: expect.any(String),
                                name: expect.any(String),
                                email: expect.any(String),
                                updatedAt: expect.any(String),
                                createdAt: expect.any(String),
                                __v: expect.any(Number)
                            }
                        }
                    )
                );
            })
    });
    it('POST /register  -> create duplicated user', () => {
        return request(app).post('/register')
            .send({
                "name": "reza",
                "email": "rEzamasoomi.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: expect.any(String)
                        }
                    )
                );
            })
    });
    it('POST /register  -> user email validation', () => {
        return request(app).post('/register')
            .send({
                "name": "reza",
                "email": "rEzam@asoomi.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: expect.any(String)
                        }
                    )
                );
            })
    });
    it('POST /register  -> do not send user params', () => {
        return request(app).post('/register')
            .send({
                "name": "reza",
                "email": "rEzam@asoomi.n@gmail.com"
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: expect.any(String)
                        }
                    )
                );
            })
    });
    it('POST /authentication  -> user authentication', () => {
        return request(app).post('/authentication')
            .send({
                "email": "rEzam@asoomi.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: {
                                _id: expect.any(String),
                                name: expect.any(String),
                                email: expect.any(String),
                                updatedAt: expect.any(String),
                                createdAt: expect.any(String),
                                __v: expect.any(Number)
                            }
                        }
                    )
                );
            })
    });


});
