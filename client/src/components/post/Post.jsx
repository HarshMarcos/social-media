import React, { useEffect, useRef, useState } from 'react'
// {post.postedBy && post.post.avatar && (
//     )}

const Post = ({ isVerified, post, className = "", isActiveTab }) => {
    const imageRef = useRef(null);
    const [lineHeight, setLineHeight] = useState(0);

    useEffect(() => {
        const calculateLineHeight = () => {
            if (imageRef.current) {
                const imageHeight = imageRef.current.getBoundingClientRect().height;
                setLineHeight(imageHeight);
            } else {
                setLineHeight(34);
            }
        }
        calculateLineHeight();
    }, [imageRef])
    return (
        <div className={`grid grid-cols-[1fr_6fr] gap-2 mx-1 py-4 sm:p-6 bg-transparent border-b border-dark-text sm:mx-auto ${className}`}>
            {/* { */}
            {/* post && ( */}
            <div className='thread_line_container'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='flex-shrink-0'>
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
                            alt='Avatar'
                            className='w-10 h-10 sm:w-12 rounded-full'
                        />
                    </div>
                    <div
                        style={{
                            height: lineHeight + "px",
                            width: "1.9px",
                            background: "gray",
                        }}
                    ></div>
                    <div className='relative bg-transparent w-full'>
                        <span className='w-6 h-6 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2'>
                            🥱
                        </span>
                        <img
                            src="https://cdn-icons-png.flaticon.com/128/149/149071.png"
                            alt="Avatar"
                            className='w-5 h-5 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 my-2'
                        />
                    </div>
                </div>
            </div>
            {/* ) */}
            {/* } */}
        </div>
    )
}

export default Post