const request = require('supertest')
const db = require('../../data/dbConfig')
const server = require('../server')
const Hobbit = require('./hobbits-model')

const newHobbit1 = {name: "Samwhat Gimikee"}
const newHobbit2 = {name: "Frida Bigguns"}

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('hobbits').truncate()
})

afterAll(async () => {
    await db.destroy();
  })

test('correct env var', () => {
    expect(process.env.NODE_ENV).toBe('testing')  
})

describe('hobbits model functions', () => {
    describe('create hobbit', () => {
        test('adds hobbit to the db', async () => {
            let hobbits 
            await Hobbit.createHobbit(newHobbit1)
            hobbits = await db('hobbits')
            expect(hobbits).toHaveLength(1)
        })
    })
})

describe('[DELETE] / deletes hobbit', () => {
    test('removes hobbit from db', async () => {
        const [id] = await db('hobbits').insert(newHobbit1)
        let hobbit = await db('hobbits').where({id}).first()
        expect(hobbit).toBeTruthy()
        await request(server).delete('/hobbits/' + id)
        hobbit = await db('hobbits').where({id}).first()
        expect(hobbit).toBeFalsy()
    })
    test('responds with the deleted hobbit', async () => {
        await db('hobbits').insert(newHobbit2)
        let hobbit = await request(server).delete('/hobbits/1')
        expect(hobbit.body).toMatchObject(newHobbit2)

    })
})

describe('[GET] /hobbits', () => {
    test('returns all hobbits', async () => {
      await db('hobbits').insert([newHobbit1, newHobbit2]);
      const res = await request(server).get('/hobbits');
      expect(res.body).toHaveLength(2);
     
    });
  
    test('returns an empty array if no hobbits', async () => {
      const res = await request(server).get('/hobbits');
      //expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('[GET] /hobbits/:id', () => {
    test('returns hobbit by id', async () => {
      const [id] = await db('hobbits').insert(newHobbit1);
      const res = await request(server).get('/hobbits/' + id);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(newHobbit1.name);
    });
  
    test('returns 404 if hobbit not found', async () => {
      const res = await request(server).get('/hobbits/999');
      expect(res.status).toBe(404);
    });
  });
  
  describe('[POST] /hobbits', () => {
    test('adds a new hobbit', async () => {
      const res = await request(server)
        .post('/hobbits')
        .send(newHobbit1);
      expect(res.body).toEqual({ id: expect.any(Number), ...newHobbit1 })
    });
  
    test('returns 400 if missing name', async () => {
      const res = await request(server)
        .post('/hobbits')
        .send({});
      expect(res.status).toBe(400)
    })
  })
  
  describe('[PUT] /hobbits/:id', () => {
    test('updates hobbit by id', async () => {
      const [id] = await db('hobbits').insert(newHobbit1)
      const updatedHobbit = { name: "Updated Hobbit" }
      const res = await request(server)
        .put('/hobbits/' + id)
        .send(updatedHobbit)
      expect(res.status).toBe(200)
      expect(res.body.name).toBe(updatedHobbit.name)
    });
  
    test('returns 404 if hobbit not found', async () => {
      const res = await request(server)
        .put('/hobbits/999')
        .send({ name: "Updated Hobbit" })
      expect(res.status).toBe(404)
    })
  })