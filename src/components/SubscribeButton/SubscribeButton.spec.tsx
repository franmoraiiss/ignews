import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />)
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />)
  
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton); 

    // Expected to signIn function to login with Github to have been called
    expect(signInMocked).toHaveBeenCalled() 
  });

  it('redirects to posts when user already has subscriptions', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    // User has to be logged in and has to have an active subscription
    useSessionMocked.mockReturnValueOnce([
      { 
        user: { 
          name: 'John Doe', 
          email: 'john.doe@example.com' 
        }, 
        activeSubscription: 'fake-active-subscription', 
        expires: 'fake-expire' 
      },
      false
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any) // We only use push from useRouter, so we can configure typescript to skip type checking

    render(<SubscribeButton />)
  
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    // expect(pushMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/posts'); // Check if function was called with parameter '/posts'
  });
})
