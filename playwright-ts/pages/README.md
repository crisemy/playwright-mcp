# Page objects

Add one page object per meaningful SUT screen or component. Keep page objects focused on locators, reusable actions, and page state. Prefer `getByRole`, `getByLabel`, and `getByTestId`; keep scenario assertions in specs unless they describe reusable page state.
