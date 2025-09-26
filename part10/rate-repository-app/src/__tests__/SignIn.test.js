import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInContainer } from '../components/SignIn';

describe('SignIn', () => {
    describe('SignInContainer', () => {
        it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
            // render the SignInContainer component, fill the text inputs and press the submit button
            const submit = jest.fn()
            render(<SignInContainer submit={submit} />)

            fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
            fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
            fireEvent.press(screen.getByText('Submit'));
            await waitFor(() => {
                expect(submit).toHaveBeenCalledTimes(1);
                expect(submit.mock.calls[0][0]).toEqual({
                    username: 'kalle',
                    password: 'password',
                });
            });
        });
    });
});