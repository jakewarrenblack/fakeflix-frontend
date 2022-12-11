import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {useLocation} from "react-router-dom";
import clsx from "clsx";

const FlashMessage = ({msg, action, translate, setShowDialog}) => {
    let {state} = useLocation()

    // react-router-dom sets location state using the 'history' package, its only dependency.
    // remix-run/history sets location.state using the browser's built-in state API.
    // couldn't find a nice way to reset location state using react-router-dom, so doing it manually with the browser's history API.
    window.history.replaceState(state, '',);

    return (
    <AlertDialog.Root defaultOpen={true}>
        <AlertDialog.Portal container={document.body}>
            <AlertDialog.Overlay className="fixed w-screen h-screen bg-navBlack opacity-90 top-0 left-0"/>
            <AlertDialog.Content className={clsx("text-black p-5 bg-white rounded w-1/4 flex flex-col m-auto", translate ? 'fixed left-1/2 translate-x-[-50%]' : 'relative')}>
                <AlertDialog.Title className="AlertDialogTitle">{msg}</AlertDialog.Title>
                <div style={{display: 'flex', gap: 25, justifyContent: 'flex-end'}}>
                    {action &&  <AlertDialog.Action asChild>
                        <button onClick={() => action(true)} className="text-white bg-red p-2 font-semibold rounded">Yes, delete</button>
                    </AlertDialog.Action>
                    }
                    <AlertDialog.Cancel asChild>
                        <button onClick={() => {
                            if(setShowDialog){
                                setShowDialog(false)
                            }
                        }}  className="text-grey-2 font-semibold bg-teal p-2 rounded">
                            {action ? 'Cancel' : 'Okay'}
                        </button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
    )
}

export default FlashMessage;
