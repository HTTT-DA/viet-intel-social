import React from 'react';
import Button from '@mui/material/Button';

const Export = () => {
    const handleUserExport = () => {
        fetch("http://localhost:8004/core/export-user/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.blob(); // Parse the response as a blob
            } else {
                throw new Error('Error while fetching data');
            }
        }).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.csv'; // Or whatever filename you want
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }).catch((error) => {
            console.error('Failed to export data: ', error);
        });
    };

    const handleQuestionExport = () => {
        fetch("http://localhost:8004/core/export-question/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.blob(); // Parse the response as a blob
            } else {
                throw new Error('Error while fetching data');
            }
        }).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'questions.csv'; // Or whatever filename you want
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }).catch((error) => {
            console.error('Failed to export data: ', error);
        });
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleUserExport}>
                Export user
            </Button>
            <Button variant="contained" color="primary" onClick={handleQuestionExport}>
                Export quesion
            </Button>
        </div>
    );
};

export default Export;
