import * as PortalPrimitive from '@radix-ui/react-portal';

// Rendered to document.body by default, allows portalling some element to wherever you want, outside where it actually is within the DOM.
const Portal = ({children}) => {
    return (
        <PortalPrimitive.Root>{children}</PortalPrimitive.Root>
    )
}

export default Portal;