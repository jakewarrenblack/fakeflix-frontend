import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import {useEffect, useRef, useState} from "react";
const Toast = ({setParentState, title, description}) => {
    const [duration, setDuration] = useState(0)

    return (
    <ToastPrimitive.Provider swipeDirection={'right'}>
        <ToastPrimitive.Root onOpenChange={() => {
            // when it closes, set the parent state to make 'toast' null again
            setParentState(null)
        }}
            className={'bg-white p-5 rounded flex flex-col items-start space-y-2'}>
            <ToastPrimitive.Title className={'text-lg font-semibold'}>{title}</ToastPrimitive.Title>
            <ToastPrimitive.Description>{description}
                {}
            </ToastPrimitive.Description>
            <ToastPrimitive.Close className={'bg-red p-2 text-white rounded'}>Okay</ToastPrimitive.Close>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport/>
    </ToastPrimitive.Provider>
    )
}

export default Toast