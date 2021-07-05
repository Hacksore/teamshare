const Broadcasters = ({ broadcasters }: { broadcasters: Array<string>}) => {
  return (
    <div>
      <h3>Broadcasters</h3>
      <pre>
        {broadcasters.map(id => (
          <span key={id}>{id}</span>
        ))}
      </pre>
    </div>
  );
};

export default Broadcasters;
