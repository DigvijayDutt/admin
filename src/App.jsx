import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import * as React from 'react';
import * as M from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import './App.css';

function App() {
  return (
    <>
      <M.Box sx={{flexGrow: 1}}>
        <M.AppBar position='static'>
          <M.Toolbar>
            <M.IconButton size="large" edge="start" color="inherit" aria-label='menu' sx={{mr:2}}><MenuIcon /></M.IconButton>
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
