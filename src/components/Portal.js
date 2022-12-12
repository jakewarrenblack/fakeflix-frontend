import * as PortalPrimitive from '@radix-ui/react-portal';

// Rendered to document.body by default, allows portalling some element to wherever you want, outside where it actually is within the DOM.
const Portal = ({children, container}) => {
    container = document.getElementById('container')

    return (
        <PortalPrimitive.Root container={container ?? document.body} >{children}</PortalPrimitive.Root>
    )
}

export default Portal;