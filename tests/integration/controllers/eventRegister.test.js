const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken')
const User = require('../../../src/models/User');
const Event = require('../../../src/models/event');
const EventRegister = require('../../../src/models/eventRegister')
let server;
describe('Event Register controller', () => {
    let existUser;
    let existEvent;
    beforeEach(() => {
        server = require('../../../src/server');
    })
    afterEach(async () => {
        await server.close();
        await Event.deleteMany({})
        await User.deleteMany({})
        await EventRegister.deleteMany({})
    })
    const createUser = async () => {
        return new User({
            firstName: 'aaa',
            lastName: 'bbb',
            email: 'test@test.com',
            password: await User.createPassword('1234567')
        }).save()
    }
    const createEvent = async () => {
        return new Event({
            title: 'Event 1',
            description: 'this is event 1 of  running',
            eventType: 'running'
        }).save();
    }

    const createEventRegister = async () => {
        if (!existUser) existUser = await createUser();
        if (!existEvent) existEvent = await createEvent();
        return new EventRegister({
            event: existEvent._id,
            user: existUser._id,
        }).save();
    }

    describe('Post Method', () => {
        let eventId;
        //let user_id;

        let token;
        beforeEach(async () => {
            const user = await createUser();
            const event = await createEvent();
            eventId = event._id;
            //  user_id = user._id;
            token = await user.generateAuthToken();

        })
        const exec = () => {
            return request(server)
                .post('/eventRegister/' + eventId)
                .set('x-auth-token', token);
        }
        it('Should return 401 if invalid token ', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401)
        })
        it('should return 400 if wrong token ', async () => {
            token = 'myowntokenstring';
            const res = await exec()
            expect(res.status).toBe(400)
        })
        it('should return 400 if generate fake token ', async () => {
            token = jwt.sign({ _id: '1', isLogin: false }, "generate_Fake_token")
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 401 if token valid but not login ', async () => {
            token = jwt.sign({ _id: '1', isLogin: false }, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
            expect(res.status).toBe(401)
        })


        it('should return 400 if user._id is invalid ', async () => {
            token = jwt.sign({ _id: '1', isLogin: true }, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
            expect(res.status).toBe(400)
        })
        it('should return 404 if User is not exist', async () => {
            token = jwt.sign({ _id: mongoose.Types.ObjectId(), isLogin: true }, process.env.JWT_PRIVATE_KEY)
            const res = await exec();
            expect(res.status).toBe(404)
        })


        it('should return 400 if invalid Event ID', async () => {
            eventId = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })


        it('should return 404 if event is not exist', async () => {
            eventId = mongoose.Types.ObjectId()
            const res = await exec();
            expect(res.status).toBe(404)
        })



        it('should return 200 if input is valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200)
        })
    })
    describe('Get Method', () => {
        let eventRegisterId;
        beforeEach(async () => {
            const eventRegister = await createEventRegister();
            eventRegisterId = eventRegister._id;
        })
        const exec = () => {
            return request(server).get('/eventRegister/' + eventRegisterId);
        }

        it('should return 400 if eventRegister is invalid', async () => {
            eventRegisterId = 1;
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 404 if eventRegister is not found', async () => {
            eventRegisterId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404)
        })
        it('should return 200 if eventRegister', async () => {
            const res = await exec();
            expect(res.status).toBe(200)
        })
    })


    describe('Post method for Approval ', () => {

        let eventRegisterId;
        let url;
        beforeEach(async () => {
            const eventRegister = await createEventRegister();
            eventRegisterId = eventRegister._id;
            url = '/eventRegister/approved/'
        })
        const exec = () => {
            return request(server).post(url + eventRegisterId);
        }

        it('Should return 400 if eventRegister is invalid ', async () => {
            eventRegisterId = 1;
            const res = await exec();
            expect(res.status).toBe(400);
        })
        it('Should return 404 if eventRegister is not found ', async () => {
            eventRegisterId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it('Should return 200 and eventRegister information if input is valid and approved', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('approved', true)
            expect(res.status).toBe(200);

        })

        it('Should return 200 and eventRegister information if input is valid and rejected', async () => {
            url = '/eventRegister/rejected/'
            const res = await exec();
            expect(res.body).toHaveProperty('approved', false)
            expect(res.status).toBe(200);

        })
    })

    describe('Get EventsRegister (AllEventsRegister)', () => {
        let token;
        beforeEach(async () => {
            await createEventRegister();
            await createEventRegister();
            token = await existUser.generateAuthToken();
        })
        const exec = () => {
            return request(server).get('/eventsRegister').set('x-auth-token', token);
        }
        it('Should return 401 if invalid token ', async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401)
        })
        it('should return 400 if wrong token ', async () => {
            token = 'myowntokenstring';
            const res = await exec()
            expect(res.status).toBe(400)
        })
        it('should return 400 if generate fake token ', async () => {
            token = await jwt.sign({ _id: '1', isLogin: false }, "generate_Fake_token")
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it('should return 401 if token valid but not login ', async () => {
            token = await jwt.sign({ _id: '1', isLogin: false }, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
            expect(res.status).toBe(401)
        })


        it('should return 400 if user._id is invalid ', async () => {
            token = await jwt.sign({ _id: '1', isLogin: true }, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
            expect(res.status).toBe(400)
        })
        it('should return 200 and empty body if User have not register any event  ', async () => {
            token = await jwt.sign({ _id: mongoose.Types.ObjectId(), isLogin: true }, process.env.JWT_PRIVATE_KEY)
            const res = await exec();
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(0)
        })

        it('should return 200 and list of register event body if User have register the events  ', async () => {
            const res = await exec();
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })



    })

})