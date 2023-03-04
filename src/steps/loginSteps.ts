import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../support/config/playwright-fixture';

Given("User navigates to the todo page", async function () {
  await expect(fixture.page).toHaveURL(/todomvc/);
});

Then("User input {string} todo",async function(todo:string) {
  await fixture.page.getByPlaceholder('What needs to be done?').fill(todo);
  await fixture.page.keyboard.press('Enter');
});

Then("User should be able to create the todo {string} successfully",async function(todo:string){
 const todoText = await fixture.page.textContent("//label[@data-testid='todo-title']");
 await expect(todoText).toEqual('shopping');
});