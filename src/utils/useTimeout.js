import React from 'react';

// source for this function: https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
// react-hookz/web provides something similar, but I don't need a full library of hooks
export default function useTimeout(callback, delay) {
    const timeoutRef = React.useRef(null);
    const savedCallback = React.useRef(callback);
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    React.useEffect(() => {
        const tick = () => savedCallback.current();
        if (typeof delay === 'number') {
            timeoutRef.current = window.setTimeout(tick, delay);
            return () => window.clearTimeout(timeoutRef.current);
        }
    }, [delay]);
    return timeoutRef;

};