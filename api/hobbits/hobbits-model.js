const db = require('../../data/dbConfig')

async function createHobbit(hobbit){
    const [id] = await db('hobbits').insert(hobbit)
    return db('hobbits').where('id', id).first()
}

async function deleteHobbit(id){
    const hobbit = await db('hobbits').where('id', id).first()
    await db('hobbits').where('id', id).del()
    return hobbit 
}

async function insert(hobbit) {
    const [id] = await db('hobbits').insert(hobbit);
    return db('hobbits').where({ id }).first();
  }
  
  async function update(id, changes) {
    await db('hobbits').where({ id }).update(changes);
    return db('hobbits').where({ id }).first();
  }
  
  function remove(id) {
    return db('hobbits').where({ id }).delete();
  }
  
  function getAll() {
    return db('hobbits');
  }
  
  function getById(id) {
    return db('hobbits').where({ id }).first();
  }

module.exports = {
    createHobbit,
    deleteHobbit,
    insert,
    update,
    remove,
    getAll,
    getById,
}