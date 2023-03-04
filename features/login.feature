@TodoFeature
Feature: Todo Feature

@sanity @prio.critical @todo
  Scenario: Verify user is able to add Todo in Todo page successfully
    Given User navigates to the todo page
    Then User input "shopping" todo
    Then User should be able to create the todo "shopping" successfully