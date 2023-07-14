import React, { createContext, useState } from 'react';

const SearchQuestionContext = createContext(undefined);

const SearchQuestionProvider = ({ children }) => {
    const [searchInput, setSearchInput] = useState('');

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
    };

    return (
        <SearchQuestionContext.Provider value={{ searchInput, handleSearchInputChange }}>
            {children}
        </SearchQuestionContext.Provider>
    );
};

export { SearchQuestionContext, SearchQuestionProvider };
