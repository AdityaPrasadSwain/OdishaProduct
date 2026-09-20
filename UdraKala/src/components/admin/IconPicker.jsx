import React from 'react';
import { IconPicker as ArknIconPicker } from '@arkn/react-icon-picker';
import '@arkn/react-icon-picker/dist/style.css';
import { useTheme } from '../../context/ThemeContext';

const IconPicker = ({ selectedIcon, onSelectIcon }) => {
    const { theme } = useTheme(); // Use the global theme if possible
    
    return (
        <div className="w-full">
            <ArknIconPicker
                value={selectedIcon || null}
                onChange={onSelectIcon}
                placeholder="Select an icon"
                valueType="name"
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default IconPicker;
