import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import AutoExpandingTextarea from './TextArea';
import { BsImages } from "react-icons/bs"

const PostForm = () => {
    const [lineHeight, setLineHeight] = useState(0);
    const parentRef = useRef(null);
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState(undefined);
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                setPreviewImage(reader.result);
                setThumbnail(file);
            })
        }
    }

    const inputChange = (text) => {
        setContent(text);
    }

    useLayoutEffect(() => {
        const parentHeight = parentRef.current.clientHeight;
        const avatarHeight = 16 * 11;
        const remainingHeight = parentHeight - avatarHeight;
        setLineHeight(remainingHeight);
    }, [parentRef]);
    return (
        <MainLayout>
            <h1 className='text-xl sm:text-2xl font-semibold dark:text-white text-center mb-4'>
                New Post
            </h1>
            <div
                ref={parentRef}
                className="grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-white dark:bg-dark-secondary border border-dark-text max-w-[600px] sm:mx-auto rounded-xl min-h-[40vh]"
            >
                <div className="thread_line_container">
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex-shrink-0'>
                            <img src="https://cdn-icons-png.flaticon.com/128/149/149071.png" alt="Avatar" className='w-12 h-12 rounded-full' />
                        </div>
                        <div
                            style={{
                                height: lineHeight + "px",
                                width: "2px",
                                background: "gray",
                            }}
                        ></div>
                    </div>
                </div>
                <form>
                    <div>
                        <h2 className='font-medium tracking-normal dark:text-white'>
                            Username
                        </h2>
                    </div>
                    <AutoExpandingTextarea onChangeText={inputChange} />
                    <label htmlFor="thumbnail">
                        <BsImages className='mt-1 text-gray-400 text-xl cursor-pointer' />
                    </label>
                    <input
                        type="file"
                        id='thumbnail'
                        className='hidden'
                        onChange={handleImageUpload}
                    />
                    {
                        previewImage && 
                        (
                            <div className='mt-4 h-56 relative'>
                                <img src={previewImage} alt="Preiview-Image" className='w-full h-full object-cover' />
                                <img src="./cancel.png" alt="Cancel" className="mt-1 w-5 cursor-pointer absolute top-0.5 right-1" onClick={() => setPreviewImage(undefined)} />
                            </div>
                        )
                    }

                    <div className='flex justify-end mt-4' style={{ userSelect: "none" }}>
                        <button disabled={!content && !thumbnail ? true : false} type='submit' className="bg-black dark:bg-white text-white dark:text-black rounded-3xl px-4 py-2 font-medium">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}

export default PostForm