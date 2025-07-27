
export function Input({ref,placeholder}: {placeholder:string ;
     ref: React.Ref<HTMLInputElement>}) {
    return (
        <input 
            ref={ref}
            type="text" 
            placeholder={placeholder} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
    )
}