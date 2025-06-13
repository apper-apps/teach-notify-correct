const Checkbox = ({ className = '', ...props }) => {
  const checkboxClasses = `w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded ${className}`;
  return (
    &lt;input type="checkbox" className={checkboxClasses} {...props} /&gt;
  );
};

export default Checkbox;