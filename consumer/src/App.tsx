import './App.css';
// The remote component provided by federation_provider
import ProviderButton from 'federation_provider/button';

const App = () => {
  return (
    <div className="content">
      <h1>Hello, I am the consumer app</h1>
      <div>
        <ProviderButton />
      </div>
    </div>
  );
};

export default App;
