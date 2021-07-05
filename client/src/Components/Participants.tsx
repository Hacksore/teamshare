const Participants = ({ participants }: { participants: Array<string>}) => {
  return (
    <div>
      <h3>Participants</h3>

      <pre>
        {participants.map(id => (
          <p key={id}>{id}</p>
        ))}
      </pre>
    </div>
  );
};

export default Participants;
