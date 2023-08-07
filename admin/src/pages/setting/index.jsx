import React, { useState } from "react";
import { Switch, Typography, Box } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";

const Setting = () => {
    const [notify, setNotify] = useState(false);

    const handleToggle = () => {
        setNotify(!notify);
    };

    return (
        <div>
            <h1 style={{ color: "#243c64" }}>Setting</h1>
            <Box bgcolor="#ffffff" padding={2} borderRadius={8} boxShadow={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>Turn on mail notification</Typography>
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
        </div>
    );
};

export default Setting;
