const chai = require('chai')
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const url = 'http://localhost:8080';

describe('create a new wallet',() => {
  it('should return a new wallet when created', (done) => {
    const walletPayload = { uuid: 1 }

    chai.request(url)
      .post('/wallets')
      .send(walletPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('uuid');
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        done();
      })
  })
})

describe('get existent wallet', () => {
  it ('is possible to get the wallet by the uuid', (done) => {
    const uuid = 1;

    chai.request(url)
      .get('/wallets/' + uuid)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('uuid');
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        expect(res.body.uuid).to.be.eql(uuid);
        done();
      });
  })
})

describe('create a new room',() => {
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
        done();
      });
  })
})

describe('create a new room booking',() => {
  it('should return a new booking when created', (done) => {
    const bookingPayload = {
      roomId: 1,
      bookerId: 1,
      dateFrom: '2021-01-05',
      dateTo: '2021-01-08'
    }

    chai.request(url)
      .post('/bookings')
      .send(bookingPayload)
      .end((err, res) => {

        console.log(res.body);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash')
        done();
      });
  })
})
