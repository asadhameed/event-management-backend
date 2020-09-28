const mongoose  = require('mongoose');
const request = require('supertest');
let server;
describe('Event Controller',()=>{
    beforeEach(()=>{
        server= require('../../../src/server');
    })
    afterEach(()=>{
        server.close();
    })
    describe('Post Method', ()=>{
        let title;
        let description;
        let price;
        let id;
        beforeEach(()=>{
            title='Event Title';
            description='Event Description';
            price=10;
            id=mongoose.Types.ObjectId()

        })

        const exec=()=>{
            return request(server).post('/event').send({title, description, price});
        }
        it('should return 400 If Title is less then 4 characters', async ()=>{
            title='aaa'
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if Title is greater then 30 characters', async()=>{
            title = new Array(32).join('a')
            const res = await exec();
            expect(res.status).toBe(400)
        })
        it('should return 400 if the description is not provide', async()=>{
            description ='';
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 400 if price is less then zero', async()=>{
            price =0;
            const res = await exec();
            expect(res.status).toBe(400)
        })

        it('should return 200 if valid input', async()=>{
            const res = await exec();
            expect(res.status).toBe(200)
        })
    })
})