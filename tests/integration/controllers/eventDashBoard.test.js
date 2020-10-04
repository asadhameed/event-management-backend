const mongoose = require('mongoose');
const request = require('supertest');
const Event = require('../../../src/models/event');
const User = require('../../../src/models/User');
let server;
describe('Event Dash Board Controller', () => {
    beforeEach(() => {
        server = require('../../../src/server')
    })
    afterEach(async () => {
        await server.close();
        await Event.deleteMany({});
        await User.deleteMany({});
    })

    const insertManyEvents = () => {
        Event.insertMany([
            {
                title: 'Event 1',
                description: 'this is event 1 of  running',
                eventType: 'running'
            },
            {
                title: 'Event 2',
                description: 'this is event 2 of running',
                eventType: 'running'
            },
            {
                title: 'Event 3',
                description: 'this is event 3 of walking',
                eventType: 'walking'
            },
        ])

    }

    // describe('Get Event by id', () => {
    //     let eventId;
    //     const exec = () => {
    //         return request(server).get('/event/' + eventId)
    //     }
    //     it('Should return 400 if invalid event id', async () => {
    //         eventId = 1;
    //         const res = await exec();
    //         expect(res.status).toBe(400)
    //     })
    //     it('Should return 404 if event do not exist', async () => {
    //         eventId = mongoose.Types.ObjectId();
    //         const res = await exec();
    //         expect(res.status).toBe(404)
    //     })
    //     it('Should return 200 and event', async () => {
    //         const event = await new Event({
    //             title: 'Event 1',
    //             description: 'this is event 1 of  running',
    //             eventType: 'running'
    //         }).save()
    //         eventId = event._id;
    //         const res = await exec();
    //         expect(res.status).toBe(200)
    //         expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description']))

    //     })
    // })
    describe('Get Events by User id', () => {
        let user_id;
        const createEventByUser = async () => {
            const user = await new User({
                firstName: 'test1',
                lastName: 'lastTest',
                email: 'test@test.com',
                password: '12345'
            }).save();
            user_id= user._id;
            await new Event({
                title:'Event 1',
                description:'this is event 1',
                eventType: 'running',
                user:user_id
            }).save();
        }
        const exec = () => {
            return request(server).get('/event/byuser/').set('user_id', user_id);
        }
        
        it('Should return 400 if invalid user id',async()=>{
            user_id=1;
           const res = await exec()
            expect(res.status).toBe(400)
        })

        it('Should return 200 and empty event list if user valid but have not create a event',async()=>{
            user_id=mongoose.Types.ObjectId();
           const res = await exec()
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0);
        })

        it('Should return 200 and receive events list if user valid and have the events',async()=>{
            await createEventByUser();
            const res = await exec()
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1);
            expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining(['title','user', 'description', 'eventType']));
        })
    })

    describe('Get All events', () => {
        it('Should return 200 and empty body if there is no event in database', async () => {
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0)
        })

        it('Should return 200 and events if there is events in  the database', async () => {

            await insertManyEvents();
            const res = await request(server).get('/events');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3)
            //expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['title', 'description', 'price', 'user','eventType']))
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        title: 'Event 1',
                        description: 'this is event 1 of  running',
                        eventType: 'running'
                    })
                ])
            );
        })
    })
    describe('Get Events by Type', () => {

        it('Should return 200 and empty body if there is no event the in database', async () => {
            const res = await request(server).get('/events/running');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(0)
        })

        it('should return 200 and events if there is specific type of events in database', async () => {
            // come here
            await insertManyEvents()
            const res = await request(server).get('/events/running');
            // because there is 2 running events
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        title: 'Event 1',
                        description: 'this is event 1 of  running',
                        eventType: 'running'
                    })
                ])
            );

            // expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining(['title', 'description', 'evenType']))
        })
    })
})