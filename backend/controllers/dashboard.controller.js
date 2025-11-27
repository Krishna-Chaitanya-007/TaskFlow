import Employee from '../models/employee.model.js';
import Task from '../models/task.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalEmployees, 
            totalTasks, 
            pendingTasks, 
            inProgressTasks, 
            completedTasks
        ] = await Promise.all([
            Employee.countDocuments(),
            Task.countDocuments(),
            Task.countDocuments({ status: 'Pending' }),
            Task.countDocuments({ status: 'In Progress' }),
            Task.countDocuments({ status: 'Completed' })
        ]);

        res.status(200).json({
            totalEmployees,
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: error.message });
    }
};