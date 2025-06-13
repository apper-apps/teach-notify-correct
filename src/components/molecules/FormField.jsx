const FormField = ({ label, children, required = false, className = '', ...props }) => {
return (
    <div className={className} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormField;