import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { setTheme } from '../store/slices/ThemeSlice.js'
import toast from 'react-hot-toast';

const MenuModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const toggleTheme = () => {
        if (theme === "dark") {
            dispatch(setTheme("light"));
            toast("Light Theme Activated", {
                duration: 1000,
                icon: "🌞",
                style: {
                    border: "1px solid #4d4d4d",
                    borderRadius: '7px',
                    background: "#333",
                    color: "#fff"
                },
            });
        } else {
            dispatch(setTheme("dark"));
            toast("Dark Theme Activated", {
                duration: 1000,
                icon: "🌛",
                style: {
                    border: '1px solid #333',
                    borderRadius: '7px',
                    background: "#fff",
                    color: "#000"
                }
            })
        }
    }

    const [isModalActive, setIsModalActive] = useState(false);
    const handleModal = () => {
        setIsModalActive((prev) => !prev)
    }
    const modalRef = useRef(null)
    return (
        <div className='min-w-36' ref={modalRef} style={{ userSelect: 'none' }}>
            <div className='flex justify-end items-center mb-2'>
                <div
                    className='text-2xl cursor-pointer flex flex-col justify-end items-end group'
                    onClick={handleModal}
                >
                    <div
                        className={`${isModalActive ? 'bg-black dark:bg-white' : "bg-dark-text"} w-6 h-[2.5px] mb-[5.5px] rounded-3xl group-hover:bg-black group-hover:dark:bg-white`}
                    ></div>
                    <div
                        className={`${isModalActive ? "bg-black dark:bg-white" : "bg-dark-text"
                            } w-4 h-[2.5px] rounded-3xl group-hover:bg-black group-hover:dark:bg-white`}
                    ></div>
                </div>
            </div>
            <div
                className='transition-opacity'
                style={{
                    opacity: isModalActive ? 1 : 0,
                    transform: isModalActive ? "translateX(0)" : "translateX(100%)",
                    pointerEvents: isModalActive ? "auto" : "none"
                }}
            >
                <ul className='bg-light-background dark:bg-dark-secondary text-black dark:text-white text-base font-medium shadow-xl rounded-lg'>
                    <li
                        className='border-b border-dark-text py-3 cursor-pointer px-6'
                        onClick={toggleTheme}
                    >
                        Switch Appearance
                    </li>
                    <li
                        className='border-b border-dark-text py-3 cursor-pointer px-6'
                    >
                        About
                    </li>
                    <li className="border-b border-dark-text py-3 cursor-pointer px-6">
                        Edit Profile
                    </li>
                    <li className="py-3 cursor-pointer px-6">Log Out</li>
                </ul>
            </div>
        </div>
    )
}

export default MenuModal