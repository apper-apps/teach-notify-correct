const Text = ({ children, className = '', type = 'p', ...props }) => {
  const Tag = type;
  return (
    &lt;Tag className={className} {...props}&gt;
      {children}
    &lt;/Tag&gt;
  );
};

export default Text;