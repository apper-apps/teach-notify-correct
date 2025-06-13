const Input = ({ type = 'text', className = '', icon: Icon, ...props }) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`;
  
  if (Icon) {
    return (
      &lt;div className="relative"&gt;
        &lt;Icon name={Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /&gt;
        &lt;input type={type} className={`pl-10 ${inputClasses}`} {...props} /&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;input type={type} className={inputClasses} {...props} /&gt;
  );
};

export default Input;