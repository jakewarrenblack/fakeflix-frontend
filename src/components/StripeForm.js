import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import {useAuth} from "../utils/useAuth";

const StripeForm = (userData) => {
    const publishableKey = "pk_test_51IUfgkLBrNI420two8HTA94zQIVcsx22GAmLMLTfT3wf7N0A1IjFelWkkUwpOiKdpVyckQ5AuLlh0TpeERzXBLI7002HeA9ZcB";
    const subscription = userData.subscription

    const {login} = useAuth()

    const subscriptions = {
        'Movies': 5.99,
        'Shows': 5.99,
        'Movies & Shows': 12.99
    }

    const amount = parseInt(subscriptions[userData.subscription])*100

    const onToken = token => {
        const body = {
            amount,
            token: token
        };

        axios
            .post(`${process.env.REACT_APP_URL}/users/register`, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...userData,
                body
            })

            .then(response => {
                console.log(response);
                alert("Payment Success");

                login({email: userData.email, password: userData.password})
            })
            .catch(error => {
                console.log("Payment Error: ", error);
                alert("Payment Error");
            });
    };  return (
        <StripeCheckout
            email={userData?.email}
            componentClass={'button'}
            label="Submit"
            name="Fakeflix"
            description={subscription}
            panelLabel="Finish and pay" //Submit button in modal
            amount={amount}
            token={onToken}
            stripeKey={publishableKey}
            image="fakeflix.png"
            billingAddress={false}
        >
            <button className={'flex w-full justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'}>Pay Now</button>
        </StripeCheckout>
    );
};export default StripeForm;