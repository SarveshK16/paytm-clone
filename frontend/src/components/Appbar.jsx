export const Appbar = () => {
    const firstName = localStorage.getItem("firstName");

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PayTF
            </div>
            <div className="flex">
                {firstName && ( // Conditional rendering for first name
                    <div className="flex flex-col justify-center h-full mr-4">
                        Hello {firstName.toUpperCase()}!!
                    </div>
                )}
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                    {firstName[0].toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};
