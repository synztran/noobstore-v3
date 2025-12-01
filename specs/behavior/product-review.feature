Feature: Product Review System
  As a customer
  I want to review products I have purchased
  So that I can share my experience and help other customers make informed decisions

  Background:
    Given I am a registered user
    And I have purchased a product

  Scenario: Submit a product review
    Given I am on the product detail page
    And I have purchased this product
    When I click "Write Review"
    And I fill in the rating (1-5 stars) and comment
    And I submit the review
    Then the review should be saved
    And it should appear in the product reviews section

  Scenario: View product reviews
    Given I am on a product detail page
    When I scroll to the reviews section
    Then I should see all approved reviews
    And each review should show rating, comment, author, and date

  Scenario: Edit my own review
    Given I have submitted a review
    When I click "Edit" on my review
    And I modify the rating or comment
    And I save the changes
    Then the review should be updated

  Scenario: Admin moderates reviews
    Given I am an admin
    When I view pending reviews
    Then I can approve or reject reviews
    And rejected reviews are not displayed publicly
