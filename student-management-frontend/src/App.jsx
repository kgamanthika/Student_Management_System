import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentLoaded] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    date: '',
    reg: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // New state for delete confirmation modal
  const [studentToDelete, setStudentToDelete] = useState(null); // To store the student ID for deletion

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        console.log("Fetched students:", res.data); // Logging fetched students to check _id
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Error fetching students: " + err.message); // Show error alert
      }
    };

    if (!studentLoaded) {
      fetchStudents();
      setStudentLoaded(true);
    }
  }, [studentLoaded]);

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setNewStudent({ name: '', date: '', reg: '' });
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentStudentId(null);
  };

  const openAddStudentModal = () => {
    resetForm(); // Reset form before adding a new student
    setIsEditMode(false); // Ensure we're in "add" mode
    setIsModalOpen(true);
  };

  const addStudent = () => {
    axios.post("http://localhost:5000/students", newStudent)
      .then(() => {
        // Option 1: Fetch the updated list of students to ensure UI is in sync
        return axios.get("http://localhost:5000/students")
          .then((response) => {
            setStudents(response.data);  // Update the UI with the new list of students
            toast.success("Student Added!"); // Success alert
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error adding student: " + err.message); // Error alert
      });

    setNewStudent({ name: '', date: '', reg: '' });  // Reset the form
    setIsModalOpen(false);  // Close the modal
  };
  
  const editStudent = (student) => {
    setNewStudent({ name: student.name, date: student.date, reg: student.reg });
    setIsEditMode(true);
    setCurrentStudentId(student._id);
    setIsModalOpen(true);
  };

  const updateStudent = () => {
    axios.put(`http://localhost:5000/students/${currentStudentId}`, newStudent)
      .then(() => {
        setStudents(students.map(student =>
          student._id === currentStudentId ? { ...student, ...newStudent } : student
        ));
        toast.success("Student updated"); // Success alert
        resetForm();
      })
      .catch((err) => {
        console.error("Error updating student:", err);
        toast.error("Error updating student: " + err.message); // Error alert
      });
  };

  const deleteStudent = () => {
    axios.delete(`http://localhost:5000/students/${studentToDelete}`)
      .then(() => {
        setStudents(students.filter(student => student._id !== studentToDelete)); // Update UI after deletion
        toast.success("Student deleted"); // Success alert
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
        toast.error("Error deleting student: " + err.message); // Error alert
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      });
  };

  const handleFormSubmit = () => {
    if (isEditMode) {
      updateStudent();
    } else {
      addStudent();
    }
  };

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId); // Set the student ID to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  return (
    <div className="flex flex-col items-center">
      <button 
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={openAddStudentModal} // Open modal for adding a new student
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
            <div key={std._id} className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50">
              <div className="w-1/4">{std.reg}</div>
              <div className="w-1/2">{std.name}</div>
              <div className="w-1/4">{std.date}</div>
              <div className="w-1/4 flex justify-center space-x-2">
                <button 
                  className="text-blue-600 hover:text-blue-800 transition"
                  onClick={() => editStudent(std)}  // Open edit modal
                >
                  <FaEdit />
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() => confirmDelete(std._id)}  // Confirm before delete
                >
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
            <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>
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
                onClick={handleFormSubmit}  // Add or update student based on mode
              >
                {isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this student?</p>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" 
                onClick={deleteStudent}  // Proceed with deletion
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Container for Toast notifications */}
    </div>
  );
}

export default App;
