export const MyDialog = ({ isOpen, data, onClose, onConfirm }: any) => {
  return (
    <>
      <div>
        <h1>My Dialog</h1>
        <p>Is open: {isOpen.toString()}</p>
        <p>Data: {JSON.stringify(data)}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </>
  );
};
