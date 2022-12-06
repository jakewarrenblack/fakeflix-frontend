import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const FlashMessage = ({msg}) => (
    <AlertDialog.Root defaultOpen={true}>
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed w-screen h-screen bg-navBlack opacity-90 top-0 left-0" />
            <AlertDialog.Content className="text-black relative p-5 bg-white rounded w-1/4 flex flex-col m-auto">
                <AlertDialog.Title className="AlertDialogTitle">{msg}</AlertDialog.Title>
                <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                    <AlertDialog.Cancel asChild>
                        <button className="text-white bg-red p-2 rounded">Okay</button>
                    </AlertDialog.Cancel>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
);

export default FlashMessage;
