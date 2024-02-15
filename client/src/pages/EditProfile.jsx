import { BiSolidEdit } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    return (
        <div className="flex overflow-x-auto items-center justify-center h-[100vh] bg-dark-secondary">
            <form
                noValidate
                encType="multipart/form-data"
                className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#4d4d4d] rounded-lg relative"
            >
                <FaArrowLeft onClick={() => navigate(-1)}
                    className="text-white absolute top-6 left-4 text-xl cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="relative">
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/149/149071.png" alt="Avatar"
                            className="w-16 rounded-full"
                        />
                        <label htmlFor="avatar">
                            <BiSolidEdit className="text-white text-xl absolute top-0 right-0" />
                        </label>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="hidden"

                        />
                    </div>
                    <h1 className="text-center text-2xl font-bold">Update Profile</h1>
                </div>

                <div className="flex flexl-col gap-1">
                    <label htmlFor="fullname" className="font-semibold">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        placeholder="Enter your fullname..."
                        className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
                    />
                </div>
                <div className="flex flexl-col gap-1">
                    <label htmlFor="fullname" className="font-semibold">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username..."
                        className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
                    />
                </div>
                <div className="flex flexl-col gap-1">
                    <label htmlFor="fullname" className="font-semibold">
                        Bio
                    </label>
                    <input
                        type="text"
                        name="bio"
                        id="bio"
                        placeholder="Enter your bio..."
                        className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-2 bg-green-600 hover:bg-green-500 rounded-md transition-all ease-in-out duration-300 py-2 font-semibold text-lg cursor-pointer flex justify-center "
                >
                    Update
                </button>
            </form>
        </div>
    )
}

export default EditProfile