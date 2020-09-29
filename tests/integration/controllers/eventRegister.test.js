const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../../../src/models/User');
const Event = require('../../../src/models/event')
let server;
describe('Event Register controller', () => {
    beforeEach(() => {
        server = require('../../../src/server');
    })
    afterEach(async () => {
        await server.close();
        await Event.deleteMany({})
        await User.deleteMany({})
    })

    describe('Post Method', () => {
        let eventId;
        let user_id;
        let eventDate;
        beforeEach(async () => {
            const user = new User({
                firstName: 'aaa',
                lastName: 'bbb',
                email: 'test@test.com',
                password: await User.createPassword('1234567')
            });
            await user.save();
            const event =  new Event({
                title: 'Event 1',
                description: 'this is event 1 of  running',
                eventType: 'running'
            })
            await event.save();

            eventId = event._id;
            user_id = user._id;
            eventDate ='2020-09-25'
        })
        const exec = () => {
            return request(server)
                .post('/eventRegister/' + eventId)
                .set('user_id', user_id)
                .send({eventDate});
        }
        it('should return 400 if invalid Event ID', async () => {
            eventId = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 if invalid user ID', async () => {
            user_id = 1;
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 404 if event is not exist', async () => {
            eventId = mongoose.Types.ObjectId()
            const res = await exec();
            expect(res.status).toBe(404)
        })

        it('should return 404 if User is not exist', async () => {
            user_id = mongoose.Types.ObjectId()
            const res = await exec();
            expect(res.status).toBe(404)
        })

        it('should return 400 if input is valid', async () => {
            eventDate= '2020'
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 200 if input is valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200)
        })
    })
})