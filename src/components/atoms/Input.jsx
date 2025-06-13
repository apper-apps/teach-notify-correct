const Input = ({ type = 'text', className = '', icon: Icon, ...props }) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`;
  
if (Icon) {
    return (
      <div className="relative">
        <Icon name={Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type={type} className={`pl-10 ${inputClasses}`} {...props} />
      </div>
    );
  }

  return (
    <input type={type} className={inputClasses} {...props} />
  );
};

export default Input;