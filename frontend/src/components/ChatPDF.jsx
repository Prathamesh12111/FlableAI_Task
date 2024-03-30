import PropTypes from 'prop-types';
import { Document, Page, Text, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const ChatPDF = ({ messages, onClose }) => {
  return (
    <div>
      <PDFViewer style={{ width: '100%', height: '100vh' }}>
        <Document>
          <Page size="A4">
            {messages.map((message, index) => (
              <Text key={index} style={styles.message}>
                {message.text}
              </Text>
            ))}
          </Page>
        </Document>
      </PDFViewer>
      <button onClick={onClose} style={styles.closeButton}>
        Close
      </button>
    </div>
  );
};

const styles = StyleSheet.create({
  message: {
    margin: 10,
    fontSize: 12,
  },
  closeButton: {
    position: 'fixed',
    bottom: 10,
    right: 10,
    padding: '5px 10px',
    backgroundColor: 'grey',
    color: 'black',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
});

ChatPDF.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      createdAt: PropTypes.number.isRequired,
      text: PropTypes.string,
      ai: PropTypes.bool,
      selected: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatPDF;