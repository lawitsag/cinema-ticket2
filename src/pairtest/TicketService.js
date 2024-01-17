import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
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
