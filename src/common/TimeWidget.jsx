import React, { useState } from 'react'

const TimeWidget = () => {
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString()
    );
    setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return (
        <div>{currentTime}</div>
    )
}

export default TimeWidget