import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaUser, FaBuilding, FaClipboardList, FaSignOutAlt, FaBars } from "react-icons/fa"; 
import { toast } from "sonner";
import { useState, useEffect } from "react";
import axios from "axios";

const SideBar = ({ isOpen }) => {
  const location = useLocation();
  const [info, setInfo] = useState(null);

  const fetchBarangay = async () => {
    try {
      const res = await axios.get('http://localhost/barangay/backend/barangay/fetch.php');
      setInfo(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBarangay();
  }, []);

  const handleLogout = async () => {
    const promise = new Promise((resolve) =>
      setTimeout(() => resolve({ name: 'Sonner' }), 2000)
    );

    toast.promise(promise, {
      loading: 'Logging out...',
      success: (data) => `${data.name} has been logged out`,
      error: 'Error during logout',
    });

    localStorage.removeItem('token');
    await promise;
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`w-64 bg-white text-gray-900 shadow-md flex flex-col  pt-12 px-6 transition-all duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed top-0 left-0 h-full z-30 lg:relative lg:translate-x-0`}
    >
      <div className="mb-8 text-center">
        <h2 className="text-base font-semibold text-gray-700">Tabogon</h2>
      </div>

      <div className="flex flex-col items-center mb-24 mt-5">
        <div className="w-20 h-20 rounded-full bg-gray-300 mb-4">
          <img
            src={`http://localhost/barangay/backend/barangay/${info?.image}`}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <p className="text-lg font-semibold">{info?.barangay_name}</p>
        <p className="text-sm text-slate-400">{info?.email}</p>
      </div>

      <nav>
        <ul>
          {[
            { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
            { path: '/admin/officials', icon: <FaUsers />, label: 'Officials' },
            { path: '/admin/residents', icon: <FaUser />, label: 'Residents' },
            { path: '/admin/households', icon: <FaBuilding />, label: 'Households' },
            { path: '/admin/transaction', icon: <FaClipboardList />, label: 'Audit Logs' },
          ].map(({ path, icon, label }) => (
            <li className="mb-6" key={path}>
              <Link
                to={path}
                className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive(path)
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 opacity-50 hover:opacity-100'
                } cursor-pointer text-sm`}
              >
                {icon}
                <p className="font-semibold ml-2">{label}</p>
              </Link>
            </li>
          ))}

          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center py-3 px-4 rounded-lg text-sm cursor-pointer hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full"
            >
              <FaSignOutAlt className="mr-3" />
              <span className="font-semibold">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const ResponsiveSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:flex">
      <div className="lg:hidden flex items-center p-4">
        <button onClick={toggleSidebar} className="text-gray-700">
          <FaBars size={24} />
        </button>
      </div>

      <SideBar isOpen={isOpen} />
    </div>
  );
};

export default ResponsiveSidebar;
