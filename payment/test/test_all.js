const chai = require('chai')
const chaiHttp = require('chai-http');
const { BookingStatus } = require('../app/models/booking');

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
        expect(res.body.uuid).to.be.eql(1);
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        expect(res.body).to.have.property('balance');
        expect(res.body.balance).to.be.eql(0.0);
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
        expect(res.body.uuid).to.be.eql(2);
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        expect(res.body).to.have.property('balance');
        expect(res.body.balance).to.be.eql(0.0);
        done();
      })
  })

  it('is possible to get wallet by the uuid', (done) => {
    chai.request(url)
      .get('/wallets/' + 1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(1);
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        expect(res.body).to.have.property('balance');
        expect(res.body.balance).to.be.eql(0.0);
      })

    chai.request(url)
      .get('/wallets/' + 2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('uuid');
        expect(res.body.uuid).to.be.eql(2);
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('mnemonic');
        expect(res.body).to.have.property('balance');
        expect(res.body.balance).to.be.eql(0.0);
        done();
      })
  })

  it('is possible to get all wallets', (done) => {
    chai.request(url)
      .get('/wallets')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.eql(2);
        res.body.forEach((wallet) => {
          expect(wallet).to.have.property('uuid');
          expect(wallet).to.have.property('address');
          expect(wallet).to.have.property('mnemonic');
          expect(wallet).to.have.property('balance');
          expect(wallet.balance).to.be.eql(0.0);
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
    const roomPayload = { ownerId: 2, price: 10 }

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
        expect(res.body.length).to.be.eql(2);
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

describe('Bookings', () => {
  it('should return a new booking when created', (done) => {
    const bookingPayload = {
      bookerId: 1,
      roomId: 2,
      dateFrom: '01-01-2021',
      dateTo: '04-01-2021'
    }

    // user 1 books room 2,
    // which belongs to user 2.

    // price(room 2) = 10
    // 4 days * price(roomId) == 40

    chai.request(url)
      .post('/bookings')
      .send(bookingPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body.price).to.be.eql(40);
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('bookerId');
        expect(res.body).to.have.property('roomOwnerId');
        expect(res.body.roomOwnerId).to.be.eql(2);
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash');
        done();
      })
  })

  it('is possible to create another booking', (done) => {
    const anotherBookingPayload = {
      bookerId: 1,
      roomId: 2,
      dateFrom: '06-01-2021',
      dateTo: '10-01-2021'
    }

    // user 1 books room 2,
    // which belongs to user 2.

    // price(room 2) = 2
    // 5 days * price(roomId) == 10

    chai.request(url)
      .post('/bookings')
      .send(anotherBookingPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body.price).to.be.eql(50);
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('bookerId');
        expect(res.body).to.have.property('roomOwnerId');
        expect(res.body.roomOwnerId).to.be.eql(2);
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash');
        done();
      })
  })

  it('is possible to get all pending bookings', (done) => {
    chai.request(url)
      .get('/bookings?' + 'roomOwnerId=' + 2 +
           '&' + 'bookingStatus=' + BookingStatus.pending)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.eql(2);
        res.body.forEach((pendingBooking) => {
          expect(pendingBooking).to.have.property('id');
          expect(pendingBooking).to.have.property('price');
          expect(pendingBooking).to.have.property('roomId');
          expect(pendingBooking).to.have.property('bookerId');
          expect(pendingBooking).to.have.property('roomOwnerId');
          expect(pendingBooking.roomOwnerId).to.be.eql(2);
          expect(pendingBooking).to.have.property('dateFrom');
          expect(pendingBooking).to.have.property('dateTo');
          expect(pendingBooking).to.have.property('bookingStatus');
          expect(pendingBooking).to.have.property('transactionStatus');
          expect(pendingBooking.transactionStatus).to.be.eql(BookingStatus.pending);
          expect(pendingBooking).to.have.property('transactionHash');
        })
        done();
      })
  })

  it('is possible to get a booking by the id', (done) => {
    chai.request(url)
      .get('/bookings/' + 1)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('bookerId');
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('roomOwnerId');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.bookingStatus).to.be.eql(BookingStatus.pending);
        done();
      })
  })

  it('is possible to accept a pending booking', (done) => {
    chai.request(url)
      .post('/bookings/' + 1 + '/accept')
      .send({ roomOwnerId: 2 })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('bookerId');
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('roomOwnerId');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.bookingStatus).to.be.eql(BookingStatus.accepted);
        done();
      })
  })

  it('is possible to reject a pending booking', (done) =>  {
    chai.request(url)
      .post('/bookings/' + 2 + '/reject')
      .send({roomOwnerId: 2})
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('price');
        expect(res.body).to.have.property('roomId');
        expect(res.body).to.have.property('bookerId');
        expect(res.body).to.have.property('dateFrom');
        expect(res.body).to.have.property('dateTo');
        expect(res.body).to.have.property('roomOwnerId');
        expect(res.body).to.have.property('bookingStatus');
        expect(res.body).to.have.property('transactionStatus');
        expect(res.body).to.have.property('transactionHash');
        expect(res.body.bookingStatus).to.be.eql(BookingStatus.rejected);
        done();
      })
  })

  it('returns zero pending bookings after accepting/rejecting all', (done) => {
    chai.request(url)
      .get('/bookings?' + 'roomOwnerId=' + 2 +
        '&' + 'bookingStatus=' + BookingStatus.pending)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.eql(0);
        done();
      })
  })
})
