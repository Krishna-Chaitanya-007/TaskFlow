import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; 
import { getTasks, getEmployees, createTask, updateTask, deleteTask } from '../services/api';

function TaskList() {
  // STATE 
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [filter, setFilter] = useState(''); 

  // Form State
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  // MODAL STATE (The new "Popup" logic)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const role = localStorage.getItem('role'); // Get "admin" or "user"

  // EFFECTS 
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchData = async () => {
    setLoading(true); 
    try {
      const [taskRes, empRes] = await Promise.all([getTasks(filter), getEmployees()]);
      setTasks(taskRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      toast.error("Failed to load data."); 
    } finally {
      setLoading(false); 
    }
  };

  // ACTIONS 

  // 1. Trigger the Modal (Don't delete yet!)
  const handleDeleteClick = (taskId) => {
      setTaskToDelete(taskId);
      setIsDeleteModalOpen(true);
  };

  // 2. Actually Delete (When user clicks "Yes, Delete" in modal)
  const confirmDelete = async () => {
      if (!taskToDelete) return;
      
      try {
          await deleteTask(taskToDelete);
          toast.success("Task Deleted!");
          fetchData(); // Refresh list
          setIsDeleteModalOpen(false); // Close modal
          setTaskToDelete(null);
      } catch (error) {
          toast.error("Failed to delete (Admins Only!)");
      }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!assignedTo) return toast.error("Please assign an employee!");
    try {
      await createTask({ title, status: 'Pending', assigned_to: assignedTo, due_date: dueDate });
      toast.success("Task Created! 🚀"); 
      setTitle(''); setAssignedTo(''); setDueDate('');
      fetchData(); 
    } catch (error) {
      toast.error("Error creating task.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
        await updateTask(taskId, { status: newStatus });
        toast.success("Status Updated!");
        fetchData();
    } catch (error) {
        toast.error("Failed to update status");
    }
  };

  // RENDER 
  return (
    <div style={{ position: 'relative' }}> {/* Relative needed for modal positioning context if needed */}
      
      {/* HEADER & FILTERS */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Task Board</h2>
        <div>
           {['', 'Pending', 'In Progress', 'Completed'].map(status => (
             <button 
               key={status}
               onClick={() => setFilter(status)} 
               style={{ 
                 marginLeft: '10px', 
                 padding: '8px 16px',
                 background: filter === status ? '#4f46e5' : '#fff',
                 color: filter === status ? '#fff' : '#4b5563',
                 border: filter === status ? 'none' : '1px solid #e5e7eb',
                 borderRadius: '20px',
                 cursor: 'pointer',
                 fontWeight: '600',
                 transition: 'all 0.2s'
               }}>
               {status || 'All Tasks'}
             </button>
           ))}
        </div>
      </div>

      {/* ADD TASK FORM */}
      <form onSubmit={handleAddTask} className="saas-card" style={{ marginBottom: '40px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '200px' }}>
            <label style={labelStyle}>Task Title</label>
            <input className="saas-input" placeholder="e.g. Update Homepage Header" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={labelStyle}>Assign To</label>
            <select className="saas-select" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
              <option value="">Select Member...</option>
              {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
            </select>
        </div>
        <div style={{ flex: 1, minWidth: '130px' }}>
            <label style={labelStyle}>Due Date</label>
            <input type="date" className="saas-input" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ cursor: 'pointer', color: dueDate ? '#111827' : '#9ca3af' }} />
        </div>
        <button type="submit" className="saas-btn" style={{ height: '46px', minWidth: '100px' }}>+ Add Task</button>
      </form>

      {/* TASK LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>⏳ Loading your tasks...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {tasks.map(task => (
            <div key={task._id} className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#111827' }}>{task.title}</h4>
                    <span className={`status-pill ${task.status === 'Completed' ? 'status-completed' : task.status === 'In Progress' ? 'status-progress' : 'status-pending'}`}>
                      {task.status}
                    </span>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
                      <span>👤</span> {task.assigned_to ? task.assigned_to.name : <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>Unassigned</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
                      <span>📅</span> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Deadline'}
                    </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                      className="saas-select" 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      style={{ 
                          padding: '10px', fontSize: '0.85rem', cursor: 'pointer', flex: 1,
                          border: `2px solid ${task.status === 'Completed' ? '#10b981' : task.status === 'In Progress' ? '#3b82f6' : '#f59e0b'}`,
                          color: task.status === 'Completed' ? '#047857' : task.status === 'In Progress' ? '#1d4ed8' : '#b45309',
                          background: '#fff' 
                      }}
                  >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🚀 In Progress</option>
                      <option value="Completed">✅ Completed</option>
                  </select>

                  {role === 'admin' && (
                      <button 
                          onClick={() => handleDeleteClick(task._id)} // Opens Modal
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', width: '42px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Task"
                      >
                          🗑
                      </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  CUSTOM DELETE CONFIRMATION MODAL  */}
      {isDeleteModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Delete Task?</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Are you sure you want to delete this task? This action cannot be undone.</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                style={{ ...modalBtnStyle, background: '#f3f4f6', color: '#374151' }}
              >
                Cancel
              </button>
              
              <button 
                onClick={confirmDelete} 
                style={{ ...modalBtnStyle, background: '#ef4444', color: 'white' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES 
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' };

// Modal Styles
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(3px)' // Nice blur effect
};

const modalStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  animation: 'fadeIn 0.2s ease-out'
};

const modalBtnStyle = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'opacity 0.2s'
};

export default TaskList;