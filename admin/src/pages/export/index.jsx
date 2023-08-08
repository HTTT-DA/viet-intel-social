import React, { useRef, useState } from 'react';
import { Button, Box, Grid, FormControl,InputLabel, Select, MenuItem }  from '@mui/material/';

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

    const handleExport = () => {
        let exportUrl = "";
        let downloadFileName = "";
        
        if (selectedField === "user") {
            exportUrl = "http://localhost:8004/core/export-user/";
            downloadFileName = "users.csv";
        } else if (selectedField === "question") {
            exportUrl = "http://localhost:8004/core/export-question/";
            downloadFileName = "questions.csv";
        } else {
            console.error('Please select a field for export');
            return;
        }

        fetch(`${exportUrl}?date=${selectedDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.blob();
            } else {
                throw new Error('Error while fetching data');
            }
        }).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFileName;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }).catch((error) => {
            console.error('Failed to export data: ', error);
        });
    };
    
    const [selectedField, setSelectedField] = useState("");
    const [selectedDate, setSelectedDate] = useState("");


    const handleFieldChange = (event) => {
        setSelectedField(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div>
            <h1 style={{ color: "#243c64" }}>Export</h1>
            
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
                <Grid container spacing={3} p={1} m={0.5}>
                    <Grid item xs={4} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel id="field-select-label">Choose field</InputLabel>
                                <Select
                                    labelId="field-select-label"
                                    id="field-select"
                                    value={selectedField}
                                    onChange={handleFieldChange}
                                >
                                    <MenuItem value={"user"}>User</MenuItem>
                                    <MenuItem value={"question"}>Question</MenuItem>
                                </Select>
                        </FormControl>             
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel id="date-select-label">Select date</InputLabel>
                            <Select
                                labelId="date-select-label"
                                id="date-select"
                                value={selectedDate}
                                onChange={handleDateChange}
                            >
                                <MenuItem value={"last-7-days"}>Last 7 days</MenuItem>
                                <MenuItem value={"this-month"}>This month</MenuItem>
                                <MenuItem value={"this-quarter"}>This quarter</MenuItem>
                                <MenuItem value={"this-year"}>This year</MenuItem>
                                <MenuItem value={"all-time"}>All time</MenuItem>
                            </Select>
                        </FormControl>           
                    </Grid>

                    <Grid item xs={4} sm={4} display={'flex'}>
                        <Box
                        display="flex"
                        justifyContent="flex-end"
                        >
                            <Button variant="contained" color="primary" onClick={handleExport}>
                                Export
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Export;
