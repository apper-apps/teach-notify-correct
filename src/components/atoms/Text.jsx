const Text = ({ children, className = '', type = 'p', ...props }) => {
  const Tag = type;
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export default Text;