import {Oval, TailSpin} from 'react-loader-spinner'

const Loading = ({loadingMsg}) => {
    return (
    <div className={'w-full h-full fixed bg-grey-2 flex justify-center items-center flex-col'}>
        {loadingMsg && <h1 className={'text-white mb-2 font-semibold'}>{loadingMsg}</h1>}
        <Oval
            height={80}
            width={80}
            color="#CC0000"
            secondaryColor={'#CC0000'}
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            strokeWidth={2}
            strokeWidthSecondary={2}

        />
    </div>
    )
}

export default Loading