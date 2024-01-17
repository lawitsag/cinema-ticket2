import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

const mockMakePayment = jest.fn();
const mockReserveSeat = jest.fn();

jest.mock('../thirdparty/paymentgateway/TicketPaymentService.js', () => {
  return function() {
    return {
      makePayment: mockMakePayment
    };
  };
});

jest.mock('../thirdparty/seatbooking/SeatReservationService.js', () => {
  return function() {
    return {
      reserveSeat: mockReserveSeat
    };
  };
});

export default class TicketService {
  #ticketPaymentService = new TicketPaymentService();
  #seatReservationService = new SeatReservationService();

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new TypeError('accountId must be an integer greater than zero');
    }

    let totalAmount = 0;
    let totalSeats = 0;
    let adultTickets = 0;
    let childOrInfantTickets = 0;

    for (const request of ticketTypeRequests) {
      const type = request.getTicketType();
      const noOfTickets = request.getNoOfTickets();

      if (type === 'ADULT') {
        totalAmount += noOfTickets * 20;
        totalSeats += noOfTickets;
        adultTickets += noOfTickets;
      } else if (type === 'CHILD') {
        totalAmount += noOfTickets * 10;
        totalSeats += noOfTickets;
        childOrInfantTickets += noOfTickets;
      } else if (type === 'INFANT') {
        childOrInfantTickets += noOfTickets;
      }

      if (totalSeats > 20 || childOrInfantTickets > adultTickets) {
        throw new InvalidPurchaseException('Invalid purchase request');
      }
    }

    if (childOrInfantTickets > 0 && adultTickets === 0) {
      throw new InvalidPurchaseException('Child or infant tickets cannot be purchased without an adult ticket');
    }

    this.#ticketPaymentService.makePayment(accountId, totalAmount);
    this.#seatReservationService.reserveSeat(accountId, totalSeats);
  }
}

describe('TicketService', () => {
  let service;

  beforeEach(() => {
    service = new TicketService();
  });

  test('should throw error when accountId is not a positive integer', () => {
    expect(() => service.purchaseTickets(-1)).toThrow(TypeError);
    expect(() => service.purchaseTickets(0)).toThrow(TypeError);
    expect(() => service.purchaseTickets('1')).toThrow(TypeError);
  });

  test('should throw error when more than 20 tickets are purchased', () => {
    const requests = new Array(21).fill(new TicketTypeRequest('ADULT', 1));
    expect(() => service.purchaseTickets(1, ...requests)).toThrow(InvalidPurchaseException);
  });

  test('should throw error when child or infant tickets are purchased without adult tickets', () => {
    const childRequest = new TicketTypeRequest('CHILD', 1);
    expect(() => service.purchaseTickets(1, childRequest)).toThrow(InvalidPurchaseException);

    const infantRequest = new TicketTypeRequest('INFANT', 1);
    expect(() => service.purchaseTickets(1, infantRequest)).toThrow(InvalidPurchaseException);
  });

  test('should calculate correct amount and reserve correct number of seats', () => {
    const adultRequest = new TicketTypeRequest('ADULT', 2);
    const childRequest = new TicketTypeRequest('CHILD', 1);
    service.purchaseTickets(1, adultRequest, childRequest);

    expect(mockMakePayment).toHaveBeenCalledWith(1, 50);
    expect(mockReserveSeat).toHaveBeenCalledWith(1, 3);
  });
});
