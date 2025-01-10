import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Error fetching students: " + err.message);
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
    resetForm();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const addStudent = () => {
    axios.post("http://localhost:5000/students", newStudent)
      .then(() => {
        return axios.get("http://localhost:5000/students")
          .then((response) => {
            setStudents(response.data);
            toast.success("Student Added!");
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error adding student: " + err.message);
      });

    setNewStudent({ name: '', date: '', reg: '' });
    setIsModalOpen(false);
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
        toast.success("Student updated");
        resetForm();
      })
      .catch((err) => {
        console.error("Error updating student:", err);
        toast.error("Error updating student: " + err.message);
      });
  };

  const deleteStudent = () => {
    axios.delete(`http://localhost:5000/students/${studentToDelete}`)
      .then(() => {
        setStudents(students.filter(student => student._id !== studentToDelete));
        toast.success("Student deleted");
        setIsDeleteModalOpen(false);
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
        toast.error("Error deleting student: " + err.message);
        setIsDeleteModalOpen(false);
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
    setStudentToDelete(studentId);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
          <h1 className="text-white text-3xl font-bold text-center">Student Management</h1>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <button 
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full hover:scale-105 transition transform"
              onClick={openAddStudentModal}
            >
              <FaPlus className="text-xl"/>
            </button>
            <h2 className="text-2xl font-semibold text-gray-700">Student List</h2>
          </div>

          <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-gray-600">Registration</th>
                  <th className="p-3 text-gray-600">Name</th>
                  <th className="p-3 text-gray-600">Date</th>
                  <th className="p-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((std) => (
                    <tr key={std._id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{std.reg}</td>
                      <td className="p-3">{std.name}</td>
                      <td className="p-3">{std.date}</td>
                      <td className="p-3 flex justify-center space-x-4">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => editStudent(std)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => confirmDelete(std._id)}
                        >
                          <IoTrashBin />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-4">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditMode ? 'Edit Student' : 'Add New Student'}</h3>
              <input 
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" 
                name="reg" 
                placeholder="Registration Number" 
                value={newStudent.reg} 
                onChange={handleInputChange} 
              />
              <input 
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text" 
                name="name" 
                placeholder="Student Name" 
                value={newStudent.name} 
                onChange={handleInputChange} 
              />
              <input 
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="date" 
                name="date" 
                value={newStudent.date} 
                onChange={handleInputChange} 
              />
              <div className="flex justify-end space-x-4">
                <button 
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                  onClick={handleFormSubmit}
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
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this student?</p>
              <div className="flex justify-end space-x-4">
                <button 
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  onClick={deleteStudent}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
