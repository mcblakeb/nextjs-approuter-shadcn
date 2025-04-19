import FlipperText from './FlipperText';
import verbs from './verbs';

export default function App() {
  const randomizeArray = verbs.sort(() => Math.random() - 0.5);

  return (
    <div className="h-full">
      <FlipperText items={randomizeArray} />
    </div>
  );
}
