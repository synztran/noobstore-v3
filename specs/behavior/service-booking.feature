Feature: Service Booking System
  As a customer
  I want to book keyboard maintenance services
  So that I can get professional keyboard repairs and upgrades

  Background:
    Given I am a registered user
    And the service booking system is available

  Scenario: Successfully book a keyboard service
    Given I have selected a keyboard service
    And I have provided all required service details
    When I submit the booking form
    Then the service should be created with status "CREATED"
    And I should receive a booking confirmation
    And the total amount should be calculated correctly

  Scenario: Book service with deposit payment
    Given I have selected a service costing 2,850,000 VND
    When I choose to pay 10% deposit (285,000 VND)
    Then the payment status should be "DEPOSIT"
    And the remaining amount should be tracked

  Scenario: View service booking details
    Given I have a service booking with ID "SV-2025-001"
    When I view the service details page
    Then I should see the service information
    And I should see the current status and timeline
    And I should see payment options

  Scenario: Update service status (Admin)
    Given I am an administrator
    And there is a service with status "CREATED"
    When I update the status to "IN_PROGRESS"
    Then the service status should change
    And a timeline entry should be added
    And the customer should be notified

  Scenario: Cancel service booking
    Given I have a service booking
    And the service is not yet completed
    When I cancel the booking
    Then the service status should be "CANCELLED"
    And any deposit should be refunded
    And I should receive a cancellation confirmation

  Scenario: Complete service booking
    Given a service is in "PACKING" status
    When the service is marked as completed
    Then the status should change to "COMPLETED"
    And the customer should be notified
    And payment should be processed if outstanding</content>
<parameter name="filePath">/Users/harry.tran/Documents/source/noobstore-web-ui/specs/behavior/service-booking.feature
