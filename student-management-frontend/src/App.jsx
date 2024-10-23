import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentLoaded] = useState(false);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        console.log("Fetched students:", res.data); // Check the data
        setStudents(res.data); // Update state with the fetched data
      } catch (err) {
        console.error("Error fetching students:", err); // Log any errors
        alert("Error fetching students: " + err.message);
      }
    };

    if (!studentLoaded) {
      fetchStudents();
      setStudentLoaded(true); // Mark as loaded to prevent re-fetch
    }
  }, [studentLoaded]); // Depend only on studentLoaded

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    date: '',
    reg: ''
  });

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value
    });
  };

  const addStudent = () => {
    axios.post("http://localhost:5000/students", newStudent)
      .then(() => {
        setStudents([...students, newStudent]);
        alert("Student Added");
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding student: " + err.message);
      });

    setNewStudent({ name: '', date: '', reg: '' }); // Clear input fields
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsModalOpen(true)} // Open modal on click
      >
        <FaPlus />
      </button>

      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 flex font-semibold">
          <div className="w-1/4">Registration</div>
          <div className="w-1/2">Name</div>
          <div className="w-1/4">Date</div>
          <div className="w-1/4 text-center">Actions</div>
        </div>
        {students.length > 0 ? (
          students.map((std) => (
            <div key={std.reg} className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50">
              <div className="w-1/4">{std.reg}</div>
              <div className="w-1/2">{std.name}</div>
              <div className="w-1/4">{std.date}</div>
              <div className="w-1/4 flex justify-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 transition">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800 transition">
                  <IoTrashBin />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No students found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            <input 
              className="w-full p-2 mb-2 border rounded" 
              type="text" 
              name="reg" 
              placeholder="Registration Number" 
              value={newStudent.reg} 
              onChange={handleInputChange} 
            />
            <input 
              className="w-full p-2 mb-2 border rounded" 
              type="text" 
              name="name" 
              placeholder="Student Name" 
              value={newStudent.name} 
              onChange={handleInputChange} 
            />
            <input 
              className="w-full p-2 mb-4 border rounded" 
              type="date" 
              name="date" 
              value={newStudent.date} 
              onChange={handleInputChange} 
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" 
                onClick={addStudent}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
