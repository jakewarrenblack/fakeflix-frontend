import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";

const stripeForm = (userData) => {
    const publishableKey = "pk_test_51IUfgkLBrNI420two8HTA94zQIVcsx22GAmLMLTfT3wf7N0A1IjFelWkkUwpOiKdpVyckQ5AuLlh0TpeERzXBLI7002HeA9ZcB";

    const onToken = token => {
        const body = {
            // TODO:
            // replace me with calculated amount from form
            // this is currently in the backend, move it
            amount: 999,
            token: token
        };  axios
            .post(`http://localhost:3000/api/users/register`, {
                // Combine the user data with the stripe token, which is needed for checkout
                // FIXME:
                // Spread operator not needed?
                ...userData,
                body
            })

            .then(response => {
                console.log(response);
                alert("Payment Success");
            })
            .catch(error => {
                console.log("Payment Error: ", error);
                alert("Payment Error");
            });
    };  return (
        <StripeCheckout
            componentClass={'button'}
            label="Submit"
            name="Fakeflix"
            // TODO:
            description="Replace me with the subscription type"
            panelLabel="Finish and pay" //Submit button in modal
            amount={999}
            token={onToken}
            stripeKey={publishableKey}
            image="fakeflix.png"
            billingAddress={false}
        >
            <button className={'flex w-full justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'}>Pay Now</button>
        </StripeCheckout>
    );
};export default stripeForm;