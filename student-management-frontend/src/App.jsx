import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        console.log("Fetched students:", res.data); // Logging fetched students to check _id
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        showAlert("Error fetching students: " + err.message, 'error');
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

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage('');
    }, 3000);
  };

  const openAddStudentModal = () => {
    resetForm(); // Reset form before adding a new student
    setIsEditMode(false); // Ensure we're in "add" mode
    setIsModalOpen(true);
  };

  const addStudent = () => {
    axios.post("http://localhost:5000/students", newStudent)
      .then(() => {
        return axios.get("http://localhost:5000/students")
          .then((response) => {
            setStudents(response.data);
            showAlert("Student Added", 'success');
          });
      })
      .catch((err) => {
        console.error(err);
        showAlert("Error adding student: " + err.message, 'error');
      });

    resetForm();
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
        showAlert("Student updated", 'success');
        resetForm();
      })
      .catch((err) => {
        console.error("Error updating student:", err);
        showAlert("Error updating student: " + err.message, 'error');
      });
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const deleteStudent = () => {
    axios.delete(`http://localhost:5000/students/${studentToDelete._id}`)
      .then(() => {
        setStudents(students.filter(student => student._id !== studentToDelete._id)); // Update UI after deletion
        showAlert("Student deleted", 'success');
        setIsDeleteModalOpen(false);  // Close the delete modal after deletion
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
        showAlert("Error deleting student: " + err.message, 'error');
        setIsDeleteModalOpen(false);  // Close the modal if there's an error
      });
  };

  const handleFormSubmit = () => {
    if (isEditMode) {
      updateStudent();
    } else {
      addStudent();
    }
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
                  onClick={() => openDeleteModal(std)}  // Open delete confirmation modal
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

      {alertMessage && (
        <div className={`fixed top-0 left-0 right-0 p-4 text-white text-center ${alertType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alertMessage}
        </div>
      )}

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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this student?</h2>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" 
                onClick={deleteStudent}  // Delete student
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
