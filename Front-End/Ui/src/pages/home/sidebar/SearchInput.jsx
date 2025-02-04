

//
export const SearchInput = () => {
    return (
        <from className='flex justify-center w-1/2 items-center gap-5 pt-5'>
            <input type="text" placeholder="Search.." className="w-1/2 rounded-4xl px-4 py-2 hover:bg-gray-700 hover:text-white-200 transition duration-300"/>
            <div className="w-[40px] h-[40px] rounded-full bg-white text-black flex justify-center items-center hover:bg-gray-700 hover:text-white transition duration-300">
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                </svg>
                </div>
        </from>
    )
}