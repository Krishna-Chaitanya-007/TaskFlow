import React, { useEffect, useState } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import toast from 'react-hot-toast';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');

  // MODAL STATE
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !email || !role) return toast.error("Please fill all fields");

    try {
      await createEmployee({ name, email, role, department: dept });
      toast.success("Team Member Added! 🎉");
      setName(''); setEmail(''); setRole(''); setDept('');
      loadEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding employee");
    }
  };

  const handleDeleteClick = (id) => {
      setEmployeeToDelete(id);
      setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
      if (!employeeToDelete) return;
      try {
          await deleteEmployee(employeeToDelete);
          toast.success("Employee Removed");
          loadEmployees();
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
      } catch (error) {
          toast.error("Failed to delete (Admins Only!)");
      }
  };

  // === SAFE AVATAR HELPERS 
  const getInitials = (n) => {
    if (!n) return "U"; // Default to "U" (Unknown) if name is missing
    const match = n.match(/(\b\S)?/g);
    return match ? match.join("").match(/(^\S|\S$)?/g).join("").toUpperCase() : "U";
  };

  const getAvatarColor = (name) => {
    if (!name) return '#e0e7ff'; // Safe Fallback Color
    const colors = ['#fee2e2', '#e0e7ff', '#d1fae5', '#fef3c7', '#fce7f3', '#e0f2fe'];
    return colors[name.length % colors.length];
  };

  const getAvatarTextColor = (name) => {
    if (!name) return '#4338ca'; // Safe Fallback Text Color
    const colors = ['#dc2626', '#4338ca', '#059669', '#d97706', '#db2777', '#0284c7'];
    return colors[name.length % colors.length];
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Team Directory</h2>
        <p style={{ color: '#6b7280', marginTop: '5px' }}>Manage your team members and their roles.</p>
      </div>
      
      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="saas-card" style={{ marginBottom: '40px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1.5, minWidth: '180px' }}>
          <label style={labelStyle}>Full Name</label>
          <input className="saas-input" placeholder="e.g. Alice Johnson" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div style={{ flex: 1.5, minWidth: '180px' }}>
          <label style={labelStyle}>Email Address</label>
          <input type="email" className="saas-input" placeholder="alice@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={labelStyle}>Job Role</label>
          <input className="saas-input" placeholder="e.g. Designer" value={role} onChange={e => setRole(e.target.value)} required />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <label style={labelStyle}>Department</label>
          <input className="saas-input" placeholder="e.g. Product" value={dept} onChange={e => setDept(e.target.value)} />
        </div>
        <button type="submit" className="saas-btn" style={{ height: '46px', minWidth: '120px' }}>+ Add Member</button>
      </form>

      {/* GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}><p>👥 Loading your team...</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {employees.map(emp => (
            <div key={emp._id} className="saas-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
              
              {/* Left: Avatar & Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', overflow: 'hidden' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '50%', 
                  // Use 'name' but fallback to "Unknown" if missing
                  background: getAvatarColor(emp.name || "Unknown"), 
                  color: getAvatarTextColor(emp.name || "Unknown"),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '18px', fontWeight: 'bold', flexShrink: 0
                }}>
                  {getInitials(emp.name || "U")}
                </div>
                
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {emp.name || "Unknown Name"}
                  </h4>
                  <span style={{ display: 'inline-block', background: '#f3f4f6', color: '#374151', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    {emp.role || "No Role"}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{emp.email}</p>
                </div>
              </div>

              {/* Right: Delete Button */}
              {userRole === 'admin' && (
                  <button 
                    onClick={() => handleDeleteClick(emp._id)}
                    style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', 
                        color: '#ef4444', fontSize: '18px', width: '35px', height: '35px',    
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    title="Remove Employee"
                  >
                    🗑
                  </button>
              )}

            </div>
          ))}
        </div>
      )}

      {/* POPUP MODAL */}
      {isDeleteModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Remove Employee?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Are you sure you want to remove this team member? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ ...modalBtnStyle, background: '#f3f4f6', color: '#374151' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ ...modalBtnStyle, background: '#ef4444', color: 'white' }}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' };
const modalStyle = { background: 'white', padding: '25px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', animation: 'fadeIn 0.2s ease-out' };
const modalBtnStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' };

export default EmployeeList;