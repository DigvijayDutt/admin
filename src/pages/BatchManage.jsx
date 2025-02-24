import NavBar from "../assets/Navbar";
import SideBar from "../assets/SideBar";
import '../styles/BatchManage.css';
function BatchManage(){
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
                    </form>
                </div>
            </div>
        </>
    );
}
export default BatchManage;