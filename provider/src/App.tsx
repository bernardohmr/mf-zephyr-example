import LocalButton from './Button';

const App = () => (
  <div style={{
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif',
  }}>
    <h1>Provider Remote App</h1>
    <LocalButton />
  </div>
);

export default App;
