import React from 'react'
import { Box, Tab as MaterialTab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { createTheme, ThemeProvider } from '@mui/material/styles'


const Tab = ({ value, tabs = [], tabPanels = [], onChange }) => {

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#0E9E52'
            }
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <TabContext value={value}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "#0E9E52",
                        ml: 3,
                        mr: 3
                    }}>
                    <TabList onChange={onChange}
                        textColor="secondary"
                        indicatorColor="secondary">
                        {tabs.map((item, index) => (
                            <MaterialTab
                                key={index}
                                label={item.label}
                                value={item.value}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "500",
                                }}
                            />
                        ))}
                    </TabList>
                </Box>
                {tabPanels.map((item, index) => (
                    <TabPanel key={index} value={item.value}>
                        {item.element}
                    </TabPanel>
                ))}
            </TabContext>
        </ThemeProvider>
    )
}

export default Tab