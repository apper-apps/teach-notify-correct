const TextArea = ({ className = '', ...props }) => {
  const textareaClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`;
  return (
    &lt;textarea className={textareaClasses} {...props} /&gt;
  );
};

export default TextArea;