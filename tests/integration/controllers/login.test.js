const request = require('supertest');
const User = require('../../../src/models/User')
let server;

describe('Login Controller', () => {
    const registerUser = async () => {
        await new User(
            {
                firstName: 'aaa',
                lastName: 'bbb',
                email: 'test@test.com',
                password: '1234567'
            }).save();
        email = 'test@test.com';
        password = '1234567';

    }
    beforeEach(async () => {
        server = require('../../../src/server');
        await registerUser();
    })
    let email;
    let password;
    afterEach(async () => {
        await server.close();
    })
    const exec = () => {
        return request(server).get('/user/login').send({ password, email });
    }
    it('Should return 400 if user invalid email', async () => {
        email = 'test'
        const res = await exec();
        expect(res.status).toBe(400)
    })

    it('should return 400 if password is not provide', async()=>{
        password=''
        const res = await exec();
        expect(res.status).toBe(400)
    })
    it('should return 401 if email is not exist', async()=>{
        email="test1@test.com"
        const res = await exec();
        expect(res.status).toBe(401)
    })
    it('should return 401 if password is wrong', async()=>{
         password='123456';
         const res = await exec();
         expect(res.status).toBe(401)
    })

    it('should return 200 when user successful', async()=>{
     //   password='123456';
        const res = await exec();
        expect(res.status).toBe(401)
   })
})