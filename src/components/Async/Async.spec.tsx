import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';

test('it renders correctly', async () => {
  render(<Async />);

  expect(screen.getByText('Hello world')).toBeInTheDocument();
  // expect(await screen.findByText('Button')).toBeInTheDocument(); // It waits for the timeout to render the button (method find)

  // await waitForElementToBeRemoved(screen.queryByText('Button'));

  // get - search element synchronously
  // query - search element synchronously but it doesn't throw any errors
  // find - if the element isn't found, keep searching and if the element isn't found again, it throws an error
  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument(); 
  });
})
