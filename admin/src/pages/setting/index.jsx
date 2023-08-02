import React, { useState } from "react";
import { Switch, Typography, Box } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";

const Setting = () => {
    const [notify, setNotify] = useState(false);

    const handleToggle = () => {
        setNotify(!notify);
    };

    return (
        <Box sx={{ flexGrow: 1, m: 3 }}>
            <Typography variant="h4">Settings</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1" sx={{ mr: 2 }}>Email notification</Typography>
                <Switch
                    checked={notify}
                    onChange={handleToggle}
                />
            </Box>
            {notify && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Info</AlertTitle>
                    Notification turned on
                </Alert>
            )}
            {!notify && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Info</AlertTitle>
                    Notification turned off
                </Alert>
            )}
        </Box>
    );
};

export default Setting;
