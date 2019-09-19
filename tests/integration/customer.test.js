const Customer = require('../../models/Customar');
const mongoose = require('mongoose')
const config = require('config')
const request = require('supertest')
const jwt = require('jsonwebtoken')
let server;


describe('Customar',() => {

  let name
  let email
  let token = 'token'

  beforeEach(() => {
    server = require('../../server')
    email = 'faisal@gmail.com'
    name = 'Faisal'
  })
  afterEach(async () => {
    server.close()
    await Customer.remove({})
  })

  const exec = async () => {
    return await request(server)
          .post('/api/customar/register')
          .set('virtual_customar_token',token)
          .send({name,email,address: 'Feni,Bangladesh',city: 'Feni',region: 'Sonagazi',postal_code: '3000',country: "Bangladesh",phone: '01822531439',password: 'faisal',confirmPassword: 'faisal'})
  }

  const login = async () => {
    return await request(server)
                 .post('/api/customar/login')
                 .send({email,password: 'faisal'})
  }

  const updateExec = async (token,password="faisal") => {
    return await request(server)
      .put('/api/customar')
      .set('virtual_customar_token',token)
      .send({name,email,address: 'Feni,Bangladesh',city: 'Feni',region: 'Sonagazi',postal_code: '3000',country: "Bangladesh",phone: '01822531439',password})
  }


  describe('POST /api/customar',() => {

    describe('/register',() => {

      it('should return 201',async () => {
        const res = await exec()
        expect(res.status).toBe(201)
      })

      it('should return 400 if name length is less than 3',async () => {
        name = 'ab'
        const res = await exec()
        expect(res.status).toBe(400)
      })

      it('should return 400 if email is not defined',async () => {
        email = ''
        const res = await exec()
        expect(res.status).toBe(400)
      })

    })

    describe('/login',() => {
      it('should return 200 if email & password is ok',async () => {
        await exec()
        const res = await login()
        expect(res.status).toBe(200)
      })

      it('should return valid jwt token if email & password is ok',async () => {
        await exec()
        const res = await login();
        const decoded = jwt.verify(res.text,config.get('jwtPrivatekey'))
        expect(decoded).toHaveProperty('_id')
      })

      it('should return 400 error if email is not defined',async () => {
        email = ''
        await exec()
        const res = await login();
        expect(res.status).toBe(400)
      })

      it('should return 400 if email or password is invalid',async () => {
        await exec()
        email = 'faisaljr@gmail.com'
        const res = await login();
        expect(res.status).toBe(400)
      })

    })

  })

  describe('Get /api/customar',() => {

    it('should return 200',async () => {
      const res = await request(server).get('/api/customar')
      expect(res.status).toBe(200)
    })

    it('should return data',async () => {
      await exec()
      const res = await request(server).get('/api/customar')
      expect(res.body.length).toBeTruthy()
      expect(res.body[0]).toHaveProperty('_id')
      expect(res.body[0]).toHaveProperty('email',email)
    })

  })

  describe('Get/api/customar/me',() => {
    it('should return 200',async () => {
      await exec()
      const loged = await login()
      const res = await request(server)
        .get('/api/customar/me')
        .set('virtual_customar_token',loged.text)

      expect(res.status).toBe(200)
    })

    it('should return 401 if token is not passed',async () => {
      await exec()
      const loged = await login()
      const res = await request(server)
        .get('/api/customar/me')

      expect(res.status).toBe(401)
    })

    it('should return 400 if token is not passed',async () => {
      await exec()
      const loged = await login()
      const res = await request(server)
        .get('/api/customar/me')
        .set('virtual_customar_token','invalid token')

      expect(res.status).toBe(400)
    })

  })

  describe('Put /api/customar',() => {
    it('should return 200',async () => {
      await exec()
      const loged = await login()
      name = 'farhad'
      email = 'farhad@gmail.com'
      const res = await updateExec(loged.text)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name','farhad')
      expect(res.body).toHaveProperty('email','farhad@gmail.com')
    })

    it('should return 400 if password is invalid ',async () => {
      await exec()
      const loged = await login()
      const res = await updateExec(loged.text,'faisaljr')
      expect(res.status).toBe(400)
    })

    it('should return 400 if token is invalid ',async () => {
      await exec()
      const loged = await login()
      const res = await updateExec('invalid token')
      expect(res.status).toBe(400)
    })

    it('should return 401 if token is not passed ',async () => {
      await exec()
      const loged = await login()
      const res = await updateExec('')
      expect(res.status).toBe(401)
    })

  })

  describe('Delete /api/customar',() => {

    it('should return 200',async () => {
      await exec()
      const customar = await request(server).get('/api/customar')
      const id = customar.body[0]._id
      const res = await request(server).delete('/api/customar/'+id)
      expect(res.status).toBe(200)
    })

    it('should return 400 if object id isnot valid',async () => {
      await exec()
      const customar = await request(server).get('/api/customar')
      const id = customar.body[0]._id
      const res = await request(server).delete('/api/customar/1')
      expect(res.status).toBe(400)
    })

    it('should return 404 if id is not passed',async () => {
      await exec()
      const res = await request(server).delete('/api/customar/')
      expect(res.status).toBe(404)
    })


  })




})
