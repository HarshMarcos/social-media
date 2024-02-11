import React from 'react'
import { useTheme } from '../hooks/useTheme';

const Logo = () => {
    const themeMode = useTheme();

    return (
        <div style={{
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
        }}>
            <img src={themeMode === "dark" ? "" : ""} alt="logo" />
        </div>
    )
}

export default Logo