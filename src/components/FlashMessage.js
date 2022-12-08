import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {useLocation} from "react-router-dom";

const FlashMessage = ({msg}) => {
    let {state} = useLocation()

    // react-router-dom sets location state using the 'history' package, its only dependency.
    // remix-run/history sets location.state using the browser's built-in state API.
    // couldn't find a nice way to reset location state using react-router-dom, so doing it manually with the browser's history API.
    window.history.replaceState(state, '',);

    return (
    <AlertDialog.Root defaultOpen={true}>
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed w-screen h-screen bg-navBlack opacity-90 top-0 left-0"/>
            <AlertDialog.Content className="text-black relative p-5 bg-white rounded w-1/4 flex flex-col m-auto">
                <AlertDialog.Title className="AlertDialogTitle">{msg}</AlertDialog.Title>
                <div style={{display: 'flex', gap: 25, justifyContent: 'flex-end'}}>
                    <AlertDialog.Cancel asChild>
                        <button  className="text-white bg-red p-2 rounded">Okay
                        </button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
    )
}

export default FlashMessage;
