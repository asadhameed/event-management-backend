const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken')
const User = require('../../../src/models/User');
const Event = require('../../../src/models/event');
const EventRegister = require('../../../src/models/eventRegister')
let server;
describe('Event Register controller', () => {
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
        const user = await createUser();
        const event = await createEvent();
        return new EventRegister({
            date: '2020-09-25',
            event: event._id,
            user: user._id,
        }).save();
    }

    describe('Post Method', () => {
        let eventId;
        let user_id;
        let eventDate;
        let token;
        beforeEach(async () => {
            const user = await createUser();
            const event = await createEvent();
            eventId = event._id;
            user_id = user._id;
            token =await user.generateAuthToken();
            eventDate = '2020-09-25'
        })
        const exec = () => {
            return request(server)
                .post('/eventRegister/' + eventId)
                .set('x-auth-token', token)
                .send({ eventDate });
        }
        it('Should return 401 if invalid token ',async()=>{
            token = '';
             const res = await exec()
            expect(res.status).toBe(401)
        })
        it('should return 400 if wrong token ', async()=>{
            token = 'myowntokenstring';
            const res = await exec()
           expect(res.status).toBe(400)
        })
        it('should return 400 if generate fake token ', async()=>{
            token = jwt.sign({_id:'1',isLogin:false}, "generate_Fake_token")
            const res = await exec()
           expect(res.status).toBe(400)
        })

        it('should return 401 if token valid but not login ', async()=>{
            token = jwt.sign({_id:'1',isLogin:false}, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
           expect(res.status).toBe(401)
        })

        
        it('should return 400 if user._id is invalid ', async()=>{
            token = jwt.sign({_id:'1',isLogin:true}, process.env.JWT_PRIVATE_KEY)
            const res = await exec()
           expect(res.status).toBe(400)
        })
        it('should return 404 if User is not exist', async () => {
            token = jwt.sign({_id:mongoose.Types.ObjectId(),isLogin:true}, process.env.JWT_PRIVATE_KEY)
            const res = await exec();
            expect(res.status).toBe(404)
        })


        it('should return 400 if invalid Event ID', async () => {
            eventId = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })
        // it('should return 400 if invalid user ID', async () => {
        //     user_id = 1;
        //     const res = await exec();
        //     expect(res.status).toBe(400)
        // })

        it('should return 404 if event is not exist', async () => {
            eventId = mongoose.Types.ObjectId()
            const res = await exec();
            expect(res.status).toBe(404)
        })

       
        it('should return 400 if input is valid', async () => {
            eventDate = '2020'
            const res = await exec();
            expect(res.status).toBe(400)
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
        let approved;
        beforeEach(async () => {
            const eventRegister = await createEventRegister();
            eventRegisterId = eventRegister._id;
            approved = true;
        })
        const exec = () => {
            return request(server).post('/eventRegister/approval/' + eventRegisterId).send({ approved });
        }
        it('should return 400 if eventRegister filed approved is not provided', async () => {
            approved = 'tre'
            const res = await exec();
            expect(res.status).toBe(400);
        })

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
            approved = false;
            const res = await exec();
            expect(res.body).toHaveProperty('approved', false)
            expect(res.status).toBe(200);

        })
        // eventRegisterApprovedOrRejected('/eventRegister/approved/',true)
    })
    // describe('Post method for Rejected ', ()=>{
    //     eventRegisterApprovedOrRejected('/eventRegister/rejected/',false)
    // })
})