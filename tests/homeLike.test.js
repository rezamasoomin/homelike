const request = require('supertest');
const app = require('../routes/index');
const Mongo = require('../loader/mongoDB');
var token;
var apartmentId;
describe('User', () => {

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
                                createdAt: expect.any(String)

                            }
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
                    {message: 'user validation failed: email: Email validation failed'}
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
    it('POST /authentication  -> user successful authentication', () => {
        return request(app).post('/authentication')
            .send({
                "email": "rezamasoomi.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function (response) {
                token = response.body.message;
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: expect.any(String)
                        }
                    )
                );

            })
    });
    it('POST /authentication  -> user password is not valid!', () => {
        return request(app).post('/authentication')
            .send({
                "email": "rezamasoomi.n@gmail.com",
                "password": "RFVrfv-124"
            })
            .expect('Content-Type', /json/)
            .expect(404)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: 'authentication failed,password is not valid!'}
                )
            })
    });
    it('POST /authentication  -> user not exist!', () => {
        return request(app).post('/authentication')
            .send({
                "email": "rezamasoomiNotFound.n@gmail.com",
                "password": "RFVrfv-123"
            })
            .expect('Content-Type', /json/)
            .expect(404)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: 'user not found!'}
                )
            })
    });


});

describe('Apartment', () => {

    it('POST /createApartment  -> create new apartment successfully', () => {
        return request(app)
            .post('/createApartment')
            .set({"token": token})
            .send({
                "title": "test title",
                "rooms": 2,
                "country": "Germany",
                "city": "berlin",
                "location": {
                    "type": "Point",
                    coordinates: [52.530121, 13.414750]
                }
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then(function (response) {
                apartmentId = response.body.message._id;
                expect(response.body).toEqual(
                    expect.objectContaining({
                            message: {
                                _id: expect.any(String),
                                user: expect.any(String),
                                title: expect.any(String),
                                country: expect.any(String),
                                city: expect.any(String),
                                rooms: expect.any(Number),
                                updatedAt: expect.any(String),
                                createdAt: expect.any(String),
                                location: expect.objectContaining({
                                    _id: expect.any(String),
                                    type: expect.any(String),
                                    coordinates: expect.arrayContaining([expect.any(Number)])
                                })
                            }
                        }
                    )
                );
            })
    });

    it('POST /createApartment  -> No token provided', () => {
        return request(app).post('/createApartment')
            .send({
                "title": "test title",
                "rooms": 2,
                "country": "Germany",
                "city": "berlin",
                "location": {
                    "type": "Point",
                    coordinates: [52.530121, 13.414750]
                }
            })
            .expect('Content-Type', /json/)
            .expect(401)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: 'No token provided'}
                );
            })
    });

    it('POST /createApartment  -> user token is not valid!', () => {
        return request(app)
            .post('/createApartment')
            .set({"token": 'invalidToken'})
            .send({
                "title": "test title",
                "rooms": 2,
                "country": "Germany",
                "city": "berlin",
                "location": {
                    "type": "Point",
                    coordinates: [52.530121, 13.414750]
                }
            })
            .expect('Content-Type', /json/)
            .expect(501)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: 'user token is not valid!'}
                );
            })
    });

    it('POST /createApartment  -> do not send required fields', () => {
        return request(app)
            .post('/createApartment')
            .set({"token": token})
            .send({
                "title": "test title",
                "rooms": 2,
                "city": "berlin",
                "location": {
                    "type": "Point",
                    coordinates: [52.530121, 13.414750]
                }
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: expect.any(String)}
                );
            })
    });

    it('GET /search -> get apartments with filters', () => {
        return request(app)
            .get('/search?rooms=2&country=Germany&city=berlin')
            .expect(200)
            .then(function (response) {
                expect(response.body).toEqual(
                    {
                        apartments:
                            expect.arrayContaining([
                                expect.objectContaining({
                                    _id: expect.any(String),
                                    user: expect.objectContaining({
                                        _id: expect.any(String),
                                        name: expect.any(String),
                                        email: expect.any(String),
                                        updatedAt: expect.any(String),
                                        createdAt: expect.any(String),
                                    }),
                                    title: expect.any(String),
                                    country: expect.any(String),
                                    city: expect.any(String),
                                    rooms: expect.any(Number),
                                    updatedAt: expect.any(String),
                                    createdAt: expect.any(String),
                                    location: expect.objectContaining({
                                        _id: expect.any(String),
                                        type: expect.any(String),
                                        coordinates: expect.arrayContaining([expect.any(Number)])
                                    })
                                })
                            ])
                    }
                );
            })
    });
    it('GET /search -> apartments not found', () => {
        return request(app)
            .get('/search?rooms=2000&country=Germany&city=tehran')
            .expect(404)
            .then(function (response) {
                expect(response.body).toEqual(
                    {
                        apartments:
                            expect.arrayContaining([])
                    }
                );
            })
    });

    it('GET /nearest -> get nearest apartments with location', () => {
        return request(app)
            .get('/nearest?longitude=52.530121&latitude=13.414751&maxDistance=10000')
            .expect(200)
            .then(function (response) {
                expect(response.body).toEqual(
                    {
                        apartments:
                            expect.arrayContaining([
                                expect.objectContaining({
                                    _id: expect.any(String),
                                    user: expect.objectContaining({
                                        _id: expect.any(String),
                                        name: expect.any(String),
                                        email: expect.any(String),
                                        updatedAt: expect.any(String),
                                        createdAt: expect.any(String),
                                    }),
                                    title: expect.any(String),
                                    country: expect.any(String),
                                    city: expect.any(String),
                                    rooms: expect.any(Number),
                                    updatedAt: expect.any(String),
                                    createdAt: expect.any(String),
                                    location: expect.objectContaining({
                                        _id: expect.any(String),
                                        type: expect.any(String),
                                        coordinates: expect.arrayContaining([expect.any(Number)])
                                    })
                                })
                            ])
                    }
                );
            })
    });

    it('GET /nearest ->  apartments not found with location search', () => {
        return request(app)
            .get('/nearest?longitude=50.486416&latitude=10.169426&maxDistance=20000')
            .expect(404)
            .then(function (response) {
                expect(response.body).toEqual(
                    {
                        apartments:
                            expect.arrayContaining([])
                    }
                );
            })
    });

});

describe('Favorites', () => {
    it('POST /addNewFavorite  -> add a apartment to favorite list successfully', () => {
        return request(app).post('/addNewFavorite')
            .set({"token": token})
            .send({
                apartmentId: apartmentId
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                            favorite: {
                                _id: expect.any(String),
                                user: expect.any(String),
                                apartments: expect.arrayContaining([expect.any(String)]),
                                updatedAt: expect.any(String),
                                createdAt: expect.any(String),
                            }
                        }
                    )
                );
            })
    })

    it('POST /addNewFavorite  -> user token is not valid!', () => {
        return request(app).post('/addNewFavorite')
            .set({"token": 'invalid token'})
            .send({
                apartmentId: apartmentId
            })
            .expect('Content-Type', /json/)
            .expect(501)
            .then(function (response) {
                expect(response.body).toEqual(
                    {message: 'user token is not valid!'}
                );


            })
    });

    it('POST /addNewFavorite  -> apartment not found!', () => {
        return request(app).post('/addNewFavorite')
            .set({"token": token})
            .send({
                apartmentId: '613345e3466437130a1acab2'
            })
            .expect('Content-Type', /json/)
            .expect(404)
            .then(function (response) {
                expect(response.body).toEqual(
                    {favorite: 'apartment not found!'}
                );


            })
    });

    it('GET /favorites  -> get favorite List of user', () => {
        return request(app).get('/favorites')
            .set({"token": token})
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function (response) {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        favoriteList: expect.arrayContaining([
                            {
                                _id: expect.any(String),
                                user: expect.objectContaining({
                                    _id: expect.any(String),
                                    name: expect.any(String),
                                    email: expect.any(String),
                                    updatedAt: expect.any(String),
                                    createdAt: expect.any(String),
                                }),
                                apartments: expect.arrayContaining([expect.objectContaining({
                                    _id: expect.any(String),
                                    user: expect.any(String),
                                    title: expect.any(String),
                                    country: expect.any(String),
                                    city: expect.any(String),
                                    rooms: expect.any(Number),
                                    updatedAt: expect.any(String),
                                    createdAt: expect.any(String),
                                    location: expect.objectContaining({
                                        _id: expect.any(String),
                                        type: expect.any(String),
                                        coordinates: expect.arrayContaining([expect.any(Number)])
                                    })
                                })]),
                                updatedAt: expect.any(String),
                                createdAt: expect.any(String),
                            }
                        ])
                    })
                );
            })
    })
});
