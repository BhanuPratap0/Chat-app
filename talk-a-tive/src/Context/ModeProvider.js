import { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

const ModeProvider = ({children}) => {

    const [mode, setMode] = useState("light");
    const [position, setPosition] = useState('absolute');

    const handleMode = () => {
        if(mode === 'light'){
            setMode('dark');
            console.log(mode);
        } else {
            setMode('light');
            console.log(mode);
        }
    }

    return <ModeContext.Provider value ={{mode, handleMode,position, setPosition}} >{children}</ModeContext.Provider>

}

export const ModeState = () => {
    return useContext(ModeContext);
};

export default ModeProvider;