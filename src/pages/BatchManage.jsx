import { useEffect, useState } from "react";
import NavBar from "../assets/Navbar";
import SideBar from "../assets/SideBar";
import '../styles/BatchManage.css';
import axios from "axios";
function BatchManage(){
    const [batches, setBatches] = useState([]);
    useEffect(()=>{
        const fetchData= async ()=>{
            try{
                const [batches] = await Promise.all([
                    axios.get("http://localhost:5000/batches")
                ]);
            } catch(e){
                console.log(e);
            }
        }
    })
    return(
        <>
            <div className="BMcontainer">
                <NavBar />
                <SideBar />
                <div className="BMform">
                    <h1>Create Batch</h1>
                    <form action="">
                       <label htmlFor="coursename">Course Name: </label>
                       <input type="text" name="coursename" />
                       <label htmlFor="instructorname">Instructor Name: </label>
                       <input type="text" name="instructorname" />
                       <label htmlFor="startdate">Start Date </label>
                       <input type="date" name="startdate" />
                       <label htmlFor="enddate">End Date </label>
                       <input type="date" name="enddate" />     
                       <label htmlFor="duration">Duration </label>
                       <input type="number" name="duration" placeholder="hrs"/>        
                       <label htmlFor="seats">Number of Seats </label>
                       <input type="number" name="seats" placeholder="Qty"/>
                       <label htmlFor="status">Status: </label>
                       <input type="radio" name="active" value="active"/>
                       <label htmlFor="active">Active</label>
                       <input type="radio" name="inactive" value="active"/>
                       <label htmlFor="inactive">In-Active</label>
                       <button type="submit">Add batch</button>
                    </form>
                </div>
                <div className="BMtable">
                    <table>
                        <thead>
                            <th>Course Name</th>
                            <th>Instructor Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Duration</th>
                            <th>Seats</th>
                            <th>Status</th>
                        </thead>
                        <tbody>
                            {batches.length===0 ? (<p>No courses available.</p>) : (
                                batches.map((batch)=>(
                                    <tr key={batch.batchId}>
                                        <td>{batch.Cname}</td>
                                        <td>{batch.Iname}</td>
                                        <td>{batch.Sdate}</td>
                                        <td>{batch.Edate}</td>
                                        <td>{batch.Dur}</td>
                                        <td>{batch.seats}</td>
                                        <td>{batch.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default BatchManage;