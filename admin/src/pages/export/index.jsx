import React, { useRef, useState } from 'react';
import { Button, Box, Grid, FormControl,InputLabel, Select, MenuItem }  from '@mui/material/';
import { exportUser, exportQuestion, exportAnswer } from '@/api-services/unified';
import CustomAlert from '../../components/alert'

const Export = () => {
    const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });

    const handleExport = () => {
        let exportFunction = null;
        let downloadFileName = "";
        
        switch (selectedField) {
            case 'user':
                exportFunction = exportUser;
                downloadFileName = 'users';
                break;
            case 'question':
                if(!selectedDate) {
                    setAlertState({ open: true, message: 'Please select a time period', severity: 'warning' });
                    break;
                }
                exportFunction = exportQuestion;
                downloadFileName = 'questions_';
                break;
            case 'answer':
                if(!selectedDate) {
                    setAlertState({ open: true, message: 'Please select a time period', severity: 'warning' });
                    break;
                }
                exportFunction = exportAnswer;
                downloadFileName = 'answers_';
                break;
            default:
                setAlertState({ open: true, message: 'Please select a field for export', severity: 'warning' });
                return;
        }
        
    
        downloadFileName += `${selectedDate}.csv`;
    
        exportFunction(selectedDate).then((res) => {
            if (res) {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', downloadFileName);
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    setAlertState({ open: true, message: 'Export successful!', severity: 'success' });
                }, 500);
                link.parentNode.removeChild(link);
            }
        }).catch((error) => {
            setAlertState({ open: true, message: error || 'Failed to export data', severity: 'error' });
        });
    };
    
    const [selectedField, setSelectedField] = useState("");
    const [selectedDate, setSelectedDate] = useState("");


    const handleFieldChange = (event) => {
        setSelectedField(event.target.value);
        if(event.target.value === "user") {
            setSelectedDate("");
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div>
            <h1 style={{ color: "#243c64" }}>Export</h1>
            {alertState.open && (
                <CustomAlert 
                    message={alertState.message} 
                    severity={alertState.severity} 
                    onClose={() => setAlertState({ open: false, message: '', severity: 'success' })}
                />
            )}
            
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
                <Grid container spacing={3} p={1} m={0.5}>
                    <Grid item xs={2} sm={2 }></Grid>
                    <Grid item xs={3} sm={3}>
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
                                    <MenuItem value={"answer"}>Answer</MenuItem>
                                </Select>
                        </FormControl>             
                    </Grid>
                    {selectedField === 'question' || selectedField === 'answer' ? (
                    <Grid item xs={3} sm={3}>
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
                    ) : <Grid item xs={3} sm={3}></Grid> }

                    <Grid item xs={3} sm={3} display={'flex'}>
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
