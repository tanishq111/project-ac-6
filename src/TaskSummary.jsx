const TaskSummary = ({children}) => {
  return (
    <div>
      <p>You have 3 tasks to finish.</p>
      {children}
    </div>
  );
};

export default TaskSummary;