export enum OrderStatus {
  // when order has been created, but the ticket it is trying to order has not been reserved
  Created = 'created',

  // The ticket the order is trying to reserve has already beebn reserved,
  // or when the user has cancelled the order
  // or the order expires before payment
  Cancelled = 'cancelled',

  // the order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // the order has reserved the ticket and the user has provide payment successfully
  Complete = 'complete',
}
