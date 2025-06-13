const FormField = ({ label, children, required = false, className = '', ...props }) => {
  return (
    &lt;div className={className} {...props}&gt;
      {label && (
        &lt;label className="block text-sm font-medium text-gray-700 mb-1"&gt;
          {label} {required && &lt;span className="text-red-500"&gt;*&lt;/span&gt;}
        &lt;/label&gt;
      )}
      {children}
    &lt;/div&gt;
  );
};

export default FormField;