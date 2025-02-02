import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as React from 'react';
import * as M from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { useState } from 'react';

function Dash() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [time, setTime] = useState([]);
    const [reg, setReg] = useState([]);
    const [error, setError] = useState("");
    const [pie ,setPie] = useState([{}]);
    const [row, setRow] = useState([{}]);
    try{
      axios.post('http://localhost:5000/reg', { time, reg });
      axios.post('http://localhost:5000/course', { pie });
      axios.post('http://localhost:5000/batch', { row });
    }
    catch(error){
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Server error, please try again later.');
      }
    };
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
  
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'firstName', headerName: 'First name', width: 130 },
      { field: 'lastName', headerName: 'Last name', width: 130 },
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
      },
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
      },
    ];
    
    const rows = [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
      { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
      { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
      { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
      { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
      { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
      { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];
  
    const paginationModel = { page: 0, pageSize: 5 };

    const DrawerList=(
        <M.Box sx={{width:200}} role="presentation" onClick={toggleDrawer(false)}>
            <M.List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <M.ListItem key={text} disablePadding>
                    <M.ListItemButton>
                    <M.ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </M.ListItemIcon>
                    <M.ListItemText primary={text} />
                    </M.ListItemButton>
                </M.ListItem>
            ))}
            </M.List>
            <M.Divider />
            <M.List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <M.ListItem key={text} disablePadding>
                    <M.ListItemButton>
                    <M.ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </M.ListItemIcon>
                    <M.ListItemText primary={text} />
                    </M.ListItemButton>
                </M.ListItem>
                ))}
            </M.List>
        </M.Box>
    );
  return (
    <>
      <M.Box sx={{flexGrow: 1}}>
        <M.AppBar position='static'>
          <M.Toolbar>
            <M.IconButton size="large" edge="start" color="inherit" aria-label='menu' sx={{mr:2}} onClick={toggleDrawer(true)}><MenuIcon /></M.IconButton>
             <M.Typography variant='h6' component="div" sx={{flexGrow:1}}>ByondBrains</M.Typography>
             <div>
              <M.IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              > 
                <AccountCircle />
              </M.IconButton>
              <M.Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <M.MenuItem onClick={handleClose}>Profile</M.MenuItem>
                <M.MenuItem onClick={handleClose}>My account</M.MenuItem>
              </M.Menu>
            </div>
          </M.Toolbar>
        </M.AppBar>
      </M.Box>
        <div>
            <M.Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </M.Drawer>
        </div>
    <M.Grid2 container spacing={2}>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={500}
        height={300}
      />
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'series A' },
              { id: 1, value: 15, label: 'series B' },
              { id: 2, value: 20, label: 'series C' },
            ],
          },
        ]}
        width={400}
        height={200}
      />
      <M.Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }} 
        />
      </M.Paper>
    </M.Grid2>
    </>
  );
}

export default Dash;