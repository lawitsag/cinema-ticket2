# Cinema Tickets Service

## Objective
This is a coding exercise which demonstrates coding skills and approach to a given problem. The code is assessed on the ability to write clean, well-tested, and reusable code, and how it ensures the following business rules are correctly met.

## Business Rules
- There are 3 types of tickets: Infant, Child, and Adult.
- The ticket prices are based on the type of ticket.
- The ticket purchaser declares how many and what type of tickets they want to buy.
- Multiple tickets can be purchased at any given time.
- Only a maximum of 20 tickets can be purchased at a time.
- Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
- Child and Infant tickets cannot be purchased without purchasing an Adult ticket.

|   Ticket Type    |     Price   |
| ---------------- | ----------- |
|    INFANT   	 |	£0  	 |
|    CHILD		 |    £10 	 |
|    ADULT		 |    £20 	 |

- There is an existing `TicketPaymentService` responsible for taking payments.
- There is an existing `SeatReservationService` responsible for reserving seats.

## Constraints
- The TicketService interface CANNOT be modified. (For Java solution only)
- The code in the thirdparty.* packages CANNOT be modified.
- The `TicketTypeRequest` SHOULD be an immutable object.

## Assumptions
You can assume:
- All accounts with an id greater than zero are valid. They also have sufficient funds to pay for any number of tickets.
- The `TicketPaymentService` implementation is an external provider with no defects. You do not need to worry about how the actual payment happens.
- The payment will always go through once a payment request has been made to the `TicketPaymentService`.
- The `SeatReservationService` implementation is an external provider with no defects. You do not need to worry about how the seat reservation algorithm works.
- The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.

## Task
Provide a working implementation of a `TicketService` that:
- Considers the above objective, business rules, constraints & assumptions.
- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`.
- Calculates the correct number of seats to reserve and makes a seat reservation request to the `SeatReservationService`.
- Rejects any invalid ticket purchase requests. It is up to you to identify what should be deemed as an invalid purchase request.

## Installation

1.Clone the repository:`git clone https://github.com/lawitsag/cinema-tickets-javascript.git`
2. Navigate to the project directory: `cd cinema-tickets-javascript`
3. Install dependencies: `npm install`
4. Install Babel and the Babel preset for Jest:npm install --save-dev babel-jest @babel/core @babel/preset-env
5. Create a .babelrc file in your project root and add the following configuration:{
  "presets": ["@babel/preset-env"]
}

## Usage

To run the project, use the following command: `npm start`

## Testing

To run tests, use the following command: `npm test`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
