Feature: Select Payment Type and Payment method for service booking
  As a customer
  I want to have an page select payment
  This payment will include what payment method support and I can choose between full payment or can paid a partical of bill about 30%

  Background
    Every register service after success register will generate an serviceBookingId - short call id SBI
    this page will base on this SBI for calling api to fetch detail service info

  Scenarios: Fail to get this SBI
    An API will check do this SBI is belong to customer base on Authorization
    If SBI is not belong with current customer login, will show a message not found service with 2 button, back to service page and contact store's support
    With a customer not login to store yet, using HOC to redirect customer to home page, also add a parameter in URL let the home page know when it should open popup login in home page
    with customer logined, and try refresh services/[id] too many times, backend going to apply limited request, so it will return error message in backend, so also need handle this error event, have notify to customer that "you have request too much times, please take a look your action" and redirect customer to home page

  Scenario: Success on get service info
    When customer_id and SBI is belong together, then API services/{id} will return an value
