const chai = require('chai')
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const url = 'http://localhost:8080';

describe('Wallet',() => {
  it('should return a new wallet when created', (done) => {
    const walletPayload = { uuid: 1 }

    chai.request(url)
      .post('/wallets')
      .send(walletPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(1)
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        done();
      })
  })

  it('is possible to create another wallet', (done) => {
    const anotherWalletPayload = { uuid: 2 }

    chai.request(url)
      .post('/wallets')
      .send(anotherWalletPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(2)
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        done();
      })
  })

  it('is possible to get wallet by the uuid', (done) => {
    chai.request(url)
      .get('/wallets/' + 1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(1)
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
      })

    chai.request(url)
      .get('/wallets/' + 2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(2)
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        done();
      })
  })

  it('is possible to get all wallets', (done) => {
    chai.request(url)
      .get('/wallets')
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.body.forEach((wallet) => {
          expect(wallet).to.have.property('uuid');
          expect(wallet).to.have.property('address');
          expect(wallet).to.have.property('mnemonic');
        })
        done();
      })

  })

})

describe('Room',() => {
  it('should return a new room when created', (done) => {
    const roomPayload = { ownerId: 1, price: 1000 }

    chai.request(url)
      .post('/rooms')
      .send(roomPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('ownerId');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.ownerId).to.be.eql(1);
        done();
      })
  })

  it('is possible to create another room', (done) => {
    const roomPayload = { ownerId: 2, price: 1000 }

    chai.request(url)
      .post('/rooms')
      .send(roomPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('ownerId');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.ownerId).to.be.eql(2);
        done();
      });
  })

  it('is possible to get the room by the id', (done) => {
    chai.request(url)
      .get('/rooms/' + 1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('ownerId');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.ownerId).to.be.eql(1);
      });

    chai.request(url)
      .get('/rooms/' + 2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('ownerId');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.ownerId).to.be.eql(2);
        done();
      });
  })

  it('is possible to get all room', (done) => {
    chai.request(url)
      .get('/rooms')
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.body.forEach((room) => {
          expect(room).to.have.property('id');
          expect(room).to.have.property('price');
          expect(room).to.have.property('ownerId');
          expect(room).to.have.property('transactionHash');
        });
        done();
      })
  })
})



