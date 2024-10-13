import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";

function App() {
  const sampleStudentData = [
    {
      name: 'Alice Johnson',
      date: '2024-01-10',
      reg: '20APC0001'
    },
    {
      name: 'Bob Smith',
      date: '2024-01-12',
      reg: '20APC0002'
    },
    {
      name: 'Charlie Brown',
      date: '2024-01-14',
      reg: '20APC0003'
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>
      <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 flex font-semibold">
          <div className="w-1/4">Registration</div>
          <div className="w-1/2">Name</div>
          <div className="w-1/4">Date</div>
          <div className="w-1/4 text-center">Actions</div>
        </div>
        {sampleStudentData.map((std) => (
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
        ))}
      </div>
    </div>
  );
}

export default App;
