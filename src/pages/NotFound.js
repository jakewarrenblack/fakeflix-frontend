export const NotFound = () => {
    document.title = 'NOT FOUND'

    return (
        <div className={'bg-grey-2 w-screen h-screen fixed flex items-center justify-center'}>
            <h1 className={'text-4xl text-white'}>Page not found!</h1>
        </div>
    )
}