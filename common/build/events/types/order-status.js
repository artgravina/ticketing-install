"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // when order has been created, but the ticket it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // The ticket the order is trying to reserve has already beebn reserved,
    // or when the user has cancelled the order
    // or the order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    // the order has successfully reserved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // the order has reserved the ticket and the user has provide payment successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
